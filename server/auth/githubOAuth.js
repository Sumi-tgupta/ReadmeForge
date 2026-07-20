/**
 * Helper client for GitHub OAuth API.
 * Includes fallback logic to simulate authentication when credentials are not configured in .env.
 */

const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const USER_PROFILE_URL = 'https://api.github.com/user';

export const githubOAuth = {
  /**
   * Determine if credentials are configured
   */
  isConfigured: () => {
    return !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
  },

  /**
   * Generate authorization URL
   * @param {string} state - CRSF token + optional redirect path
   */
  getAuthorizeUrl: (state) => {
    if (!githubOAuth.isConfigured()) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('GitHub OAuth credentials are not configured in production environment.');
      }
      // Offline mock authentication callback path
      return `/api/auth/callback?code=mock_oauth_code_12345&state=${state}`;
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3001/api/auth/callback';
    
    return `${AUTHORIZE_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user&state=${state}`;
  },

  /**
   * Exchange OAuth code for GitHub Access Token
   */
  exchangeCodeForToken: async (code) => {
    if (!githubOAuth.isConfigured()) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('GitHub OAuth credentials are not configured in production environment.');
      }
      return 'mock_access_token_12345';
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3001/api/auth/callback';

    const res = await fetch(ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri
      })
    });

    if (!res.ok) {
      throw new Error(`Failed to exchange code for token: ${res.statusText}`);
    }

    const data = await res.json();
    if (data.error) {
      throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
    }

    return data.access_token;
  },

  /**
   * Load User Profile details using the access token
   */
  getGithubProfile: async (accessToken) => {
    if (!githubOAuth.isConfigured() || accessToken === 'mock_access_token_12345') {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('GitHub OAuth credentials are not configured in production environment.');
      }
      // Offline fallback mock profile
      return {
        id: 12345678,
        login: 'mockdeveloper',
        name: 'Mock Developer',
        email: 'mock@readmeforge.com',
        avatar_url: 'https://github.com/github.png',
        html_url: 'https://github.com/mockdeveloper'
      };
    }

    const res = await fetch(USER_PROFILE_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'User-Agent': 'README-Forge-App'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch user profile: ${res.statusText}`);
    }

    return res.json();
  }
};

export default githubOAuth;
