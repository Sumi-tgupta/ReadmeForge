import { sessionManager } from '../sessionManager.js';

/**
 * Authentication middleware bridging Express requests to the database-backed sessionManager.
 * Enforces valid session cookies for secure endpoints.
 */
export async function authMiddleware(req, res, next) {
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

/**
 * Optional auth — doesn't reject, just attaches user if valid session exists.
 */
export async function optionalAuth(req, res, next) {
  try {
    const session = await sessionManager.getSession(req);
    if (session) {
      req.user = session.user;
      req.sessionId = session.id;
      await sessionManager.refreshSession(session.id, res);
    }
    next();
  } catch (_) {
    next();
  }
}

export default authMiddleware;
