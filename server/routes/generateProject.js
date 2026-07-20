import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { optionalAuth } from '../middleware/auth.js';
import { callGemini, GeminiRateLimitError, GeminiAuthError } from '../services/ai/geminiProvider.js';
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
 * Coordinates the full project generation intelligence engine pipeline.
 */
router.post('/', optionalAuth, guestLimiter, generateLimiter, async (req, res, next) => {
  const clientId = getClientId(req);
  const { repoUrl, mode = 'standard' } = req.body;

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
    // 3. Persistent Cache Check (SQLite database)
    // We construct a cache key based on owner/repo/mode
    const cacheKey = buildCacheKey(owner, repo, 'default', mode);
    const cachedRow = await getPersistentCache(cacheKey);
    
    if (cachedRow && cachedRow.generatedReadme) {
      console.log(`[Project Generate] Database cache hit for ${cacheKey}`);
      
      // Deduct credit for cached project generation
      if (req.user) {
        try {
          await UserModel.deductCredit(req.user.id);
        } catch (deductErr) {
          console.error('[Project Generate] Credit deduction failed on cache hit:', deductErr.message);
        }
      }

      // Track usage for cached project generation
      try {
        await trackUsage(req.user?.id, 'cache', { inputTokens: 0, outputTokens: 0 }, cacheKey);
      } catch (trackErr) {
        console.error('[Project Generate] Usage tracking error on cache hit:', trackErr.message);
      }

      return res.json({
        success: true,
        cached: true,
        markdown: cachedRow.generatedReadme
      });
    }

    // 4. Perform repository scan
    console.log(`[Project Generate] Scanning repository contents: ${repoUrl}`);
    const repoData = await scanRepository(repoUrl, mode);

    // 5. Construct highly compressed, token-efficient prompt
    const systemPrompt = `You are an expert technical writer and developer documentation generator. You write high-quality, professional, well-structured GitHub project READMEs in markdown. You know all GitHub markdown formatting options, badges, codeblocks, tables, and structures. You always output ONLY raw markdown — no code fences, no explanation, no preamble. Start directly with the markdown content.
CRITICAL BADGE RULES:
1. Only generate a License Badge if the License metadata is not 'None'. If it is 'None', do NOT include a license badge, and state in the license section that the project is unlicensed.
2. Only generate a Build Status / CI/CD Badge if 'CI/CD (GitHub Actions)' is explicitly present in the Features list. In that case, use the actual workflow file name found in the directory structure (under .github/workflows/) to build the shields.io URL. If no workflow file exists in the directory, do NOT include a build status badge.
3. Only generate a Code Style Badge (such as Black) if the tool (like 'black') is explicitly present in the dependencies. Do not guess or assume.
4. Do NOT include any emojis in the generated content under any circumstances. Keep all headings and text strictly professional and textual.`;

    const prompt = `Generate a professional, comprehensive README.md for this GitHub project:
Repository Name: ${repoData.repository.name}
Owner: ${repoData.repository.owner}
Description: ${repoData.repository.description}
License: ${repoData.repository.license}
Primary Languages: ${repoData.stack.languages.join(', ')}
Detected Frameworks: ${repoData.stack.frameworks.join(', ')}
Identified Stack: ${JSON.stringify(repoData.stack)}
Architectures: ${repoData.architectures.join(', ')}
Features: ${repoData.features.join(', ')}
Available Scripts/Commands: ${JSON.stringify(repoData.commands)}

Simplified directory structure walk-through:
${repoData.structure.join('\n')}

Structure the README with:
- Project Title and a short, powerful subtitle.
- Status/Meta badges (using shields.io formatting conforming strictly to the system badge rules).
- Detailed Description (including target audience, problems it solves, and core value).
- Features list.
- Tech Stack.
- Folder structure walkthrough.
- Installation and setup guidelines (realistic commands based on commands map).
- Usage instructions.
- License section (only include if a valid license is present).
`;

    // 6. Call AI Gateway with Retry + Fallback Chain
    const modelChain = getModelChain();
    let result = null;
    let lastError = null;
    let usedModel = null;

    // Use gemini-2.5-flash-lite as priority for fast, cheap generations
    const preferredModelChain = [
      { model: 'gemini-2.5-flash-lite', temperature: 0.7, topP: 0.9, maxOutputTokens: 3000 },
      ...modelChain
    ];

    for (const modelConfig of preferredModelChain) {
      try {
        console.log(`[Project Generate] Requesting model: ${modelConfig.model}`);

        result = await withRetry(() =>
          callGemini({
            model: modelConfig.model,
            prompt,
            systemPrompt,
            maxOutputTokens: modelConfig.maxOutputTokens || 3000,
            temperature: modelConfig.temperature || 0.7,
            topP: modelConfig.topP || 0.9
          })
        );

        usedModel = modelConfig.model;
        recordSuccess(modelConfig.model);
        break; // Generation successful, exit fallback loop
      } catch (err) {
        lastError = err;
        recordFailure(modelConfig.model);
        console.log(`[Project Generate] Model ${modelConfig.model} failed: ${err.message}`);
        
        if (err instanceof GeminiAuthError) {
          break; // Authentication errors are unrecoverable by fallbacks
        }
      }
    }

    if (!result) {
      const details = process.env.NODE_ENV === 'development' && lastError
        ? { message: lastError.message, status: lastError.status }
        : undefined;

      if (lastError instanceof GeminiAuthError) {
        return res.status(500).json({ error: 'Server AI configuration error.', debug: details });
      }
      return res.status(502).json({ error: 'AI generation failed after all retries.', debug: details });
    }

    // 7. Write to persistent SQLite cache
    const dbKey = buildCacheKey(owner, repo, repoData.repository.defaultBranch, mode);
    await setPersistentCache(dbKey, owner, repo, repoData.repository, repoData, result.text, mode);

    // 8. Track usage logs in db
    try {
      await trackUsage(req.user?.id, usedModel, result.usage, dbKey);
    } catch (trackErr) {
      console.error('[Project Generate] Usage tracking error:', trackErr.message);
    }

    // --- Deduct credit ---
    if (req.user) {
      try {
        await UserModel.deductCredit(req.user.id);
      } catch (deductErr) {
        console.error('[Project Generate] Credit deduction failed:', deductErr.message);
      }
    }

    // 9. Respond
    return res.json({
      success: true,
      cached: false,
      markdown: result.text
    });

  } catch (err) {
    console.error('[Project Generate] Pipeline error:', err.message);
    
    const statusCode = err.message.includes('not found') || err.message.includes('Invalid') ? 400 : 500;
    return res.status(statusCode).json({ error: err.message });
  } finally {
    releaseSlot(clientId);
  }
});

/**
 * Track usage in the generations table (best-effort).
 */
async function trackUsage(userId, model, usage, promptHash) {
  try {
    await GenerationModel.trackUsage(userId, model, usage, promptHash, 'project');
  } catch {
    // Silently fail
  }
}

export default router;
