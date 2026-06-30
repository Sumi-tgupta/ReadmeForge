import { sessionManager } from '../sessionManager.js';

/**
 * Authentication middleware bridging Express requests to the database-backed sessionManager.
 * Enforces valid session cookies for secure endpoints.
 */
export function authMiddleware(req, res, next) {
  const session = sessionManager.getSession(req);

  if (!session) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Refresh expiration timing silently to extend session
  sessionManager.refreshSession(session.id, res);

  req.user = session.user;
  req.sessionId = session.id;
  
  next();
}

/**
 * Optional auth — doesn't reject, just attaches user if valid session exists.
 */
export function optionalAuth(req, res, next) {
  const session = sessionManager.getSession(req);
  if (session) {
    req.user = session.user;
    req.sessionId = session.id;
    sessionManager.refreshSession(session.id, res);
  }
  next();
}

export default authMiddleware;
