import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { githubOAuth } from '../auth/githubOAuth.js';
import { sessionManager } from '../sessionManager.js';
import { UserModel } from '../models/User.js';

const router = Router();
const STATE_COOKIE_NAME = 'oauth_state';

/**
 * POST /api/auth/login
 * Starts OAuth flow for the frontend SPA by returning the authorization URL
 */
router.post('/login', (req, res) => {
  const redirectPath = req.body.redirect || '/';
  const csrfToken = uuidv4();
  const state = `${csrfToken}:${redirectPath}`;

  // Store CSRF state token in cookie (expires in 10 minutes)
  const isProduction = process.env.NODE_ENV === 'production';
  let cookieStr = `${STATE_COOKIE_NAME}=${csrfToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`;
  if (isProduction) {
    cookieStr += '; Secure';
  }
  res.setHeader('Set-Cookie', cookieStr);

  const authUrl = githubOAuth.getAuthorizeUrl(state);
  res.json({ url: authUrl });
});

/**
 * GET /api/auth/login
 * Standard GET redirect entry point
 */
router.get('/login', (req, res) => {
  const redirectPath = req.query.redirect || '/';
  const csrfToken = uuidv4();
  const state = `${csrfToken}:${redirectPath}`;

  const isProduction = process.env.NODE_ENV === 'production';
  let cookieStr = `${STATE_COOKIE_NAME}=${csrfToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`;
  if (isProduction) {
    cookieStr += '; Secure';
  }
  res.setHeader('Set-Cookie', cookieStr);

  res.redirect(githubOAuth.getAuthorizeUrl(state));
});

/**
 * GET /api/auth/callback
 * GitHub OAuth redirection callback endpoint
 */
router.get('/callback', async (req, res, next) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).send('OAuth callback parameters missing.');
    }

    // Parse state: "csrfToken:redirectPath"
    const parts = state.split(':');
    const stateToken = parts[0];
    const redirectPath = parts[1] || '/';

    // Parse cookies from headers
    const rawCookies = req.headers.cookie || '';
    const cookiesList = {};
    rawCookies.split(';').forEach(c => {
      const p = c.split('=');
      cookiesList[p.shift().trim()] = decodeURI(p.join('='));
    });

    const savedState = cookiesList[STATE_COOKIE_NAME];

    // CSRF Prevention Verification
    if (!savedState || savedState !== stateToken) {
      return res.status(403).send('Cross-Site Request Forgery (CSRF) detected. Auth state token mismatch.');
    }

    // Clear state cookie
    res.setHeader('Set-Cookie', `${STATE_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`);

    // Exchange code for token
    const token = await githubOAuth.exchangeCodeForToken(code);

    // Get GitHub Profile
    const profile = await githubOAuth.getGithubProfile(token);

    // Create / Update User record
    const user = UserModel.upsertGithubUser(profile);

    // Create session cookie
    sessionManager.createSession(user.id, res);

    // Redirect user browser back to frontend
    const clientOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
    res.redirect(`${clientOrigin}${redirectPath}?login=success`);

  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * Load current authenticated user profile (frictionless, returns null if logged out)
 */
router.get('/me', (req, res) => {
  const session = sessionManager.getSession(req);
  if (!session) {
    return res.json({ user: null });
  }

  // Extend session duration on active profile loads
  sessionManager.refreshSession(session.id, res);
  res.json({ user: session.user });
});

/**
 * POST /api/auth/logout
 * Terminate active session and clear cookie
 */
router.post('/logout', (req, res) => {
  sessionManager.destroySession(req, res);
  res.json({ success: true });
});

/**
 * GET /api/auth/status
 * Load login status
 */
router.get('/status', (req, res) => {
  const session = sessionManager.getSession(req);
  res.json({
    authenticated: !!session,
    user: session ? session.user : null
  });
});

export default router;
