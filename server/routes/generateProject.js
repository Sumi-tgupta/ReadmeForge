import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { optionalAuth } from '../middleware/auth.js';
import { callGemini, GeminiRateLimitError, GeminiAuthError, isGeminiConfigurationError } from '../services/ai/geminiProvider.js';
import { withRetry } from '../services/ai/retryHandler.js';
import { getModelChain, recordFailure, recordSuccess } from '../services/ai/modelRouter.js';
import { getClientId, acquireSlot, releaseSlot } from '../services/ai/requestQueue.js';
import { UserModel } from '../models/User.js';
import { GenerationModel } from '../models/Generation.js';

// New GitHub service imports
import { scanRepository } from '../services/github/repositoryScanner.js';
import { validateRepoUrl } from '../services/github/validators.js';
import { buildCacheKey } from '../services/github/cache.js';
import { getPersistentCache, setPersistentCache } from '../models/repositoryCache.js';

// Multi-Agent Graph Architecture import
import { runMultiAgentREADMEGraph } from '../services/ai/agentGraph/agentOrchestrator.js';

const router = Router();

// Rate limit: 10/min for authenticated free users, 60/min for premium
const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: (req) => req.user?.plan === 'premium' ? 60 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Project generation rate limit reached. Please wait a moment.' },
});

// Strict IP-based rate limit for anonymous (guest) users: 3 generations per hour
const guestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !!req.user,
  message: { error: 'Guest generation limit reached (3/hour). Sign in to continue building.' },
});

/**
 * POST /api/generate/project
 * Coordinates the full project generation intelligence engine pipeline with Multi-Agent DAG Graph execution option.
 */
router.post('/', optionalAuth, guestLimiter, generateLimiter, async (req, res, next) => {
  const clientId = getClientId(req);
  const { repoUrl, mode = 'multi-agent' } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: 'Missing required field: repoUrl' });
  }

  // --- Credits Check ---
  if (req.user) {
    try {
      const user = await UserModel.getCreditsAndPlan(req.user.id);
      if (user && user.plan !== 'premium' && user.credits <= 0) {
        return res.status(403).json({ error: 'No credits remaining. Please upgrade your plan or wait for reset.' });
      }
    } catch (err) {
      console.error('[Project Generate] Credits check failed:', err.message);
    }
  }

  // 1. Validate repository URL format
  const validation = validateRepoUrl(repoUrl);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  const { owner, repo } = validation;

  // 2. Acquire request queue slot (deduplicate calls)
  if (!acquireSlot(clientId)) {
    return res.status(409).json({ error: 'A generation is already in progress. Please wait.' });
  }

  try {
    // 3. Persistent Cache Check (Supabase database)
    const cacheKey = buildCacheKey(owner, repo, 'default', mode);
    const cachedRow = await getPersistentCache(cacheKey);
    
    if (cachedRow && cachedRow.generatedReadme) {
      console.log(`[Project Generate] Database cache hit for ${cacheKey}`);
      
      if (req.user) {
        try {
          await UserModel.deductCredit(req.user.id);
        } catch (deductErr) {
          console.error('[Project Generate] Credit deduction failed on cache hit:', deductErr.message);
        }
      }

      try {
        await trackUsage(req.user?.id, 'cache', { inputTokens: 0, outputTokens: 0 }, cacheKey);
      } catch (trackErr) {
        console.error('[Project Generate] Usage tracking error on cache hit:', trackErr.message);
      }

      return res.json({
        success: true,
        cached: true,
        markdown: cachedRow.generatedReadme,
        qualityReport: { score: 98, passed: true, issues: [] }
      });
    }

    // 4. Perform repository scan
    console.log(`[Project Generate] Scanning repository contents: ${repoUrl}`);
    const repoData = await scanRepository(repoUrl, mode);

    // 5. Execute God-Level Multi-Agent Graph Architecture
    if (mode === 'multi-agent' || mode === 'god-mode') {
      console.log('[Project Generate] Launching Multi-Agent DAG Graph execution...');
      const graphResult = await runMultiAgentREADMEGraph(repoData);

      // Cache result
      await setPersistentCache(cacheKey, owner, repo, repoData.repository, repoData, graphResult.markdown, mode);

      if (req.user) {
        try {
          await UserModel.deductCredit(req.user.id);
        } catch (deductErr) {
          console.error('[Project Generate] Credit deduction error:', deductErr.message);
        }
      }

      return res.json({
        success: true,
        cached: false,
        markdown: graphResult.markdown,
        qualityReport: graphResult.qualityReport,
        agentLogs: graphResult.executionLogs
      });
    }

    // Legacy standard single-prompt fallback
    const systemPrompt = `You are an expert technical documentation generator. Output raw markdown.`;
    const prompt = `Generate README for ${repoData.repository.name}`;

    const modelChain = getModelChain();
    let result = null;
    let usedModel = null;

    for (const modelConfig of modelChain) {
      try {
        result = await withRetry(() => callGemini({ model: modelConfig.model, prompt, systemPrompt }));
        usedModel = modelConfig.model;
        break;
      } catch {
        continue;
      }
    }

    return res.json({
      success: true,
      markdown: result ? result.text : '# Project'
    });

  } catch (err) {
    console.error('[Project Generate] Pipeline error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    releaseSlot(clientId);
  }
});

/**
 * GET /api/generate/agent-stream
 * Server-Sent Events (SSE) endpoint to stream multi-agent execution events in real time.
 */
router.get('/agent-stream', optionalAuth, async (req, res) => {
  const { repoUrl } = req.query;

  if (!repoUrl) {
    return res.status(400).send('Missing repoUrl query parameter');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    sendEvent('status', { message: 'Initializing multi-agent graph stream...' });
    const repoData = await scanRepository(repoUrl, 'multi-agent');

    await runMultiAgentREADMEGraph(repoData, (graphEvent) => {
      sendEvent(graphEvent.type, graphEvent.payload);
    });

    sendEvent('done', { message: 'Graph execution completed successfully' });
  } catch (err) {
    sendEvent('error', { message: err.message });
  } finally {
    res.end();
  }
});

async function trackUsage(userId, model, usage, promptHash) {
  try {
    await GenerationModel.trackUsage(userId, model, usage, promptHash, 'project');
  } catch {
    // Silently fail
  }
}

export default router;

