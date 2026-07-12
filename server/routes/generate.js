import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { optionalAuth } from '../middleware/auth.js';
import { callGemini, GeminiRateLimitError, GeminiAuthError, isGeminiConfigurationError } from '../services/ai/geminiProvider.js';
import { withRetry } from '../services/ai/retryHandler.js';
import { hashKey, getCached, setCache, getCacheStats } from '../services/ai/cache.js';
import { buildOptimizedPrompt } from '../services/ai/promptOptimizer.js';
import { getModelChain, recordFailure, recordSuccess, getModelHealth } from '../services/ai/modelRouter.js';
import { getClientId, acquireSlot, releaseSlot } from '../services/ai/requestQueue.js';
import { UserModel } from '../models/User.js';
import { GenerationModel } from '../models/Generation.js';

const router = Router();

// Rate limit: 10/min for free users, 60/min for premium
const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: (req) => req.user?.plan === 'premium' ? 60 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Generation rate limit reached. Please wait a moment.' },
});

/**
 * POST /api/generate
 * Full AI gateway: validate → deduplicate → cache check → optimize prompt →
 * model selection → generate with retry + fallback → cache result → track usage.
 *
 * Request body: { formData: object, selectedSections: string[] }
 * Response: { markdown: string, usage: object, cached: boolean }
 */
router.post('/', optionalAuth, generateLimiter, async (req, res, next) => {
  const clientId = getClientId(req);

  // --- Credits Check ---
  if (req.user) {
    console.log('[Generate] Credits check for user:', req.user.id);
    try {
      const user = await UserModel.getCreditsAndPlan(req.user.id);
      console.log('[Generate] User plan details:', user);
      if (user && user.plan !== 'premium' && user.credits <= 0) {
        return res.status(403).json({ error: 'No credits remaining. Please upgrade your plan or wait for reset.' });
      }
    } catch (err) {
      console.error('[Generate] Credits check failed:', err.message);
    }
  } else {
    console.log('[Generate] No user session found (anonymous request)');
  }

  try {
    const { formData, selectedSections } = req.body;

    // --- Validate ---
    if (!formData || !formData.name || !formData.username) {
      return res.status(400).json({ error: 'Missing required fields: name and username' });
    }
    if (!selectedSections || !Array.isArray(selectedSections) || selectedSections.length === 0) {
      return res.status(400).json({ error: 'At least one section must be selected' });
    }

    // --- Deduplicate ---
    if (!acquireSlot(clientId)) {
      return res.status(409).json({ error: 'A generation is already in progress. Please wait for it to complete.' });
    }

    try {
      // --- Cache check ---
      const cacheHash = hashKey(formData, selectedSections);
      const cachedMarkdown = getCached(cacheHash);
      if (cachedMarkdown) {
        console.log(`[Generate] Cache hit for hash ${cacheHash.slice(0, 12)}...`);
        
        // Deduct credit for cached profile generation
        if (req.user) {
          try {
            await UserModel.deductCredit(req.user.id);
          } catch (deductErr) {
            console.error('[Generate] Credit deduction failed on cache hit:', deductErr.message);
          }
        }

        // Track usage for cached profile generation
        try {
          await trackUsage(req.user?.id, 'cache', { inputTokens: 0, outputTokens: 0 }, cacheHash);
        } catch (trackErr) {
          console.error('[Generate] Usage tracking failed on cache hit:', trackErr.message);
        }

        return res.json({
          markdown: cachedMarkdown,
          usage: { inputTokens: 0, outputTokens: 0, model: 'cache', cached: true },
          cached: true,
        });
      }

      // --- Optimize prompt ---
      const { prompt, systemPrompt, estimatedTokens } = buildOptimizedPrompt(formData, selectedSections);
      console.log(`[Generate] Prompt built: ~${estimatedTokens} tokens`);

      // --- Model selection + generation with fallback ---
      const modelChain = getModelChain();
      let result = null;
      let lastError = null;
      let usedModel = null;

      for (const modelConfig of modelChain) {
        try {
          console.log(`[Generate] Trying model: ${modelConfig.model}`);

          result = await withRetry(() =>
            callGemini({
              model: modelConfig.model,
              prompt,
              systemPrompt,
              maxOutputTokens: modelConfig.maxOutputTokens,
              temperature: modelConfig.temperature,
            })
          );

          usedModel = modelConfig.model;
          recordSuccess(modelConfig.model);
          break; // Success — exit the model chain loop
        } catch (err) {
          lastError = err;
          recordFailure(modelConfig.model);
          console.log(`[Generate] Model ${modelConfig.model} failed: ${err.message}`);

          // Don't try fallback models for API-key/project configuration errors — they'll all fail.
          // Other 403s can be model-specific, so continue through the fallback chain.
          if (err instanceof GeminiAuthError && isGeminiConfigurationError(err)) {
            break;
          }
          // Continue to next model in the chain
        }
      }

      if (!result) {
        // All models failed
        const details = process.env.NODE_ENV === 'development' && lastError
          ? { message: lastError.message, status: lastError.status, details: lastError.details }
          : undefined;

        if (lastError instanceof GeminiAuthError && isGeminiConfigurationError(lastError)) {
          return res.status(500).json({
            error: 'Server AI configuration error. Verify GEMINI_API_KEY and Google Generative Language API access.',
            debug: details
          });
        }
        if (lastError instanceof GeminiRateLimitError) {
          return res.status(429).json({ error: 'AI servers are busy. Please try again in a moment.', debug: details });
        }
        return res.status(502).json({ error: 'AI generation failed after all retries. Please try again shortly.', debug: details });
      }

      // --- Cache result ---
      setCache(cacheHash, result.text);

      // --- Deduct credit ---
      if (req.user) {
        console.log('[Generate] Attempting to deduct credit for user:', req.user.id);
        try {
          const resDeduct = await UserModel.deductCredit(req.user.id);
          console.log('[Generate] Credit deduction result:', resDeduct);
        } catch (deductErr) {
          console.error('[Generate] Credit deduction failed:', deductErr.message);
        }
      }

      // --- Track usage (best-effort, don't fail the request) ---
      try {
        trackUsage(req.user?.id, usedModel, result.usage, cacheHash);
      } catch (trackErr) {
        console.error('[Generate] Usage tracking failed:', trackErr.message);
      }

      // --- Return ---
      return res.json({
        markdown: result.text,
        usage: { ...result.usage, cached: false },
        cached: false,
      });
    } finally {
      releaseSlot(clientId);
    }
  } catch (err) {
    releaseSlot(clientId);
    next(err);
  }
});


/**
 * GET /api/generate/health
 * Returns cache stats, model health, and queue status (dev only).
 */
router.get('/health', (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json({
    cache: getCacheStats(),
    models: getModelHealth(),
  });
});

/**
 * Track usage in the generations table (best-effort).
 */
async function trackUsage(userId, model, usage, promptHash) {
  try {
    await GenerationModel.trackUsage(userId, model, usage, promptHash, 'profile');
  } catch {
    // Silently fail — usage tracking is best-effort
  }
}

export default router;
