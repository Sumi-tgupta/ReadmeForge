import { getDb } from './db/connection.js';
import { v4 as uuidv4 } from 'uuid';

const SESSION_COOKIE_NAME = 'session_id';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Parse cookies manually from headers
 */
function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
}

export const sessionManager = {
  /**
   * Create a new session in database and attach secure HttpOnly cookie
   */
  createSession: (userId, res) => {
    const db = getDb();
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

    // Store session in SQLite
    db.prepare(`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (?, ?, ?)
    `).run(sessionId, userId, expiresAt);

    // Set secure cookie
    const isProduction = process.env.NODE_ENV === 'production';
    let cookieStr = `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION_MS / 1000}`;
    if (isProduction) {
      cookieStr += '; Secure';
    }

    res.setHeader('Set-Cookie', cookieStr);
    return sessionId;
  },

  /**
   * Validate and load session + user details from request cookies
   */
  getSession: (req) => {
    const db = getDb();
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies[SESSION_COOKIE_NAME];

    if (!sessionId) return null;

    const now = new Date().toISOString();
    const session = db.prepare(`
      SELECT s.*, u.username, u.display_name, u.email, u.avatar_url, u.profile_url, u.plan, u.role
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ? AND s.expires_at > ?
    `).get(sessionId, now);

    if (!session) return null;

    return {
      id: session.id,
      userId: session.user_id,
      expiresAt: session.expires_at,
      user: {
        id: session.user_id,
        username: session.username,
        displayName: session.display_name,
        email: session.email,
        avatarUrl: session.avatar_url,
        profileUrl: session.profile_url,
        plan: session.plan,
        role: session.role
      }
    };
  },

  /**
   * Refresh expiration timer for an active session
   */
  refreshSession: (sessionId, res) => {
    const db = getDb();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

    db.prepare(`
      UPDATE sessions
      SET expires_at = ?
      WHERE id = ?
    `).run(expiresAt, sessionId);

    const isProduction = process.env.NODE_ENV === 'production';
    let cookieStr = `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION_MS / 1000}`;
    if (isProduction) {
      cookieStr += '; Secure';
    }

    res.setHeader('Set-Cookie', cookieStr);
  },

  /**
   * Destroy the session in DB and clear response cookies
   */
  destroySession: (req, res) => {
    const db = getDb();
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies[SESSION_COOKIE_NAME];

    if (sessionId) {
      db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    }

    // Clear client cookie
    res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`);
  }
};

export default sessionManager;
