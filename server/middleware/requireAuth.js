import { sessionManager } from '../sessionManager.js';

/**
 * Middleware that secures endpoints by enforcing valid session cookies.
 * Attaches verified user details to req.user and refreshes session active timers.
 */
export async function requireAuth(req, res, next) {
  try {
    const session = await sessionManager.getSession(req);

    if (!session) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Refresh expiration timing silently to extend session
    await sessionManager.refreshSession(session.id, res);

    req.user = session.user;
    req.sessionId = session.id;

    next();
  } catch (err) {
    next(err);
  }
}

export default requireAuth;
