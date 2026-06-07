import { Router } from 'express';
import { getDb } from '../db/connection.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

/**
 * GET /api/user/credits — Get current credit balance.
 */
router.get('/credits', (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT credits, plan, credits_reset_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    credits: user.credits,
    plan: user.plan,
    isUnlimited: user.plan === 'premium',
    resetsAt: user.credits_reset_at,
  });
});

/**
 * POST /api/user/credits/deduct — Deduct one credit after generation.
 */
router.post('/credits/deduct', (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT credits, plan FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.plan === 'premium') {
    return res.json({ credits: -1, message: 'Unlimited credits' });
  }

  if (user.credits <= 0) {
    return res.status(403).json({ error: 'No credits remaining', credits: 0 });
  }

  db.prepare('UPDATE users SET credits = credits - 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(req.user.id);
  const updated = db.prepare('SELECT credits FROM users WHERE id = ?').get(req.user.id);

  res.json({ credits: updated.credits });
});

/**
 * GET /api/user/usage — Get generation usage stats.
 */
router.get('/usage', (req, res) => {
  const db = getDb();

  const total = db.prepare(
    'SELECT COUNT(*) as count, SUM(input_tokens) as inputTokens, SUM(output_tokens) as outputTokens FROM generations WHERE user_id = ?'
  ).get(req.user.id);

  const today = db.prepare(
    "SELECT COUNT(*) as count FROM generations WHERE user_id = ? AND created_at >= date('now')"
  ).get(req.user.id);

  res.json({
    totalGenerations: total.count,
    totalInputTokens: total.inputTokens || 0,
    totalOutputTokens: total.outputTokens || 0,
    todayGenerations: today.count,
  });
});

export default router;
