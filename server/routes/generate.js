import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { optionalAuth } from '../middleware/auth.js';
import { callGemini, GeminiRateLimitError, GeminiAuthError } from '../services/ai/geminiProvider.js';
import { withRetry } from '../services/ai/retryHandler.js';
import { hashKey, getCached, setCache, getCacheStats } from '../services/ai/cache.js';
import { buildOptimizedPrompt } from '../services/ai/promptOptimizer.js';
import { getModelChain, recordFailure, recordSuccess, getModelHealth } from '../services/ai/modelRouter.js';
import { getClientId, acquireSlot, releaseSlot } from '../services/ai/requestQueue.js';

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

          // Don't try fallback models for auth errors — they'll all fail
          if (err instanceof GeminiAuthError) {
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

        if (lastError instanceof GeminiAuthError) {
          return res.status(500).json({ error: 'Server AI configuration error. Contact admin.', debug: details });
        }
        if (lastError instanceof GeminiRateLimitError) {
          return res.status(429).json({ error: 'AI servers are busy. Please try again in a moment.', debug: details });
        }
        return res.status(502).json({ error: 'AI generation failed after all retries. Please try again shortly.', debug: details });
      }

      // --- Cache result ---
      setCache(cacheHash, result.text);

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
function trackUsage(userId, model, usage, promptHash) {
  try {
    // Dynamic import to avoid circular dependency issues at startup
    import('../db/connection.js').then(({ getDb }) => {
      const db = getDb();
      db.prepare(`
        INSERT INTO generation_history (id, user_id, model, input_tokens, output_tokens, prompt_hash, builder_type, cached, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'profile', 0, CURRENT_TIMESTAMP)
      `).run(
        uuidv4(),
        userId || 'anonymous',
        model,
        usage.inputTokens || 0,
        usage.outputTokens || 0,
        promptHash
      );
    }).catch(() => {});
  } catch {
    // Silently fail — usage tracking is best-effort
  }
}

export default router;
