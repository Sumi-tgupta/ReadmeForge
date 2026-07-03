import { Router } from 'express';
import { UserModel } from '../models/User.js';
import { GenerationModel } from '../models/Generation.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

/**
 * GET /api/user/credits — Get current credit balance.
 */
router.get('/credits', async (req, res, next) => {
  try {
    const user = await UserModel.getCreditsAndPlan(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      credits: user.credits,
      plan: user.plan,
      isUnlimited: user.plan === 'premium',
      resetsAt: user.credits_reset_at,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/user/credits/deduct — Deduct one credit after generation.
 */
router.post('/credits/deduct', async (req, res, next) => {
  try {
    const user = await UserModel.getCreditsAndPlan(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.plan === 'premium') {
      return res.json({ credits: -1, message: 'Unlimited credits' });
    }

    if (user.credits <= 0) {
      return res.status(403).json({ error: 'No credits remaining', credits: 0 });
    }

    const updated = await UserModel.deductCredit(req.user.id);
    if (!updated) return res.status(500).json({ error: 'Failed to deduct credit' });

    res.json({ credits: updated.credits });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/user/usage — Get generation usage stats.
 */
router.get('/usage', async (req, res, next) => {
  try {
    const stats = await GenerationModel.getUsageStats(req.user.id);
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;
