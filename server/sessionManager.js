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
  createSession: async (userId, res) => {
    const supabase = getDb();
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

    // Store session in Supabase
    const { error } = await supabase
      .from('sessions')
      .insert({
        id: sessionId,
        user_id: userId,
        expires_at: expiresAt
      });

    if (error) {
      console.error('[SessionManager] createSession error:', error.message);
      throw error;
    }

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
  getSession: async (req) => {
    const supabase = getDb();
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies[SESSION_COOKIE_NAME];

    if (!sessionId) return null;

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('sessions')
      .select('id, user_id, expires_at, users (username, display_name, email, avatar_url, profile_url, plan, role)')
      .eq('id', sessionId)
      .gt('expires_at', now)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error('[SessionManager] getSession error:', error.message);
      return null;
    }

    const userData = data.users;
    if (!userData) return null;

    return {
      id: data.id,
      userId: data.user_id,
      expiresAt: data.expires_at,
      user: {
        id: data.user_id,
        username: userData.username,
        displayName: userData.display_name,
        email: userData.email,
        avatarUrl: userData.avatar_url,
        profileUrl: userData.profile_url,
        plan: userData.plan,
        role: userData.role
      }
    };
  },

  /**
   * Refresh expiration timer for an active session
   */
  refreshSession: async (sessionId, res) => {
    const supabase = getDb();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

    const { error } = await supabase
      .from('sessions')
      .update({ expires_at: expiresAt })
      .eq('id', sessionId);

    if (error) {
      console.error('[SessionManager] refreshSession error:', error.message);
    }

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
  destroySession: async (req, res) => {
    const supabase = getDb();
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies[SESSION_COOKIE_NAME];

    if (sessionId) {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) console.error('[SessionManager] destroySession error:', error.message);
    }

    // Clear client cookie
    res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`);
  }
};

export default sessionManager;
