/**
 * Authentication service — API calls for login, signup, logout.
 * Phase 1: Stubs that work with local state only.
 * Phase 4: Wired to real backend endpoints.
 */
import api from './api';

/**
 * Login with email and password.
 * @returns {Promise<{user: object, token: string}>}
 */
export async function login(email, password) {
  const data = await api.post('/auth/login', { email, password });
  if (data.token) {
    localStorage.setItem('auth_token', data.token);
  }
  return data;
}

/**
 * Sign up with email, name, and password.
 * @returns {Promise<{user: object, token: string}>}
 */
export async function signup(email, name, password) {
  const data = await api.post('/auth/signup', { email, name, password });
  if (data.token) {
    localStorage.setItem('auth_token', data.token);
  }
  return data;
}

/**
 * Log out the current user.
 */
export function logout() {
  localStorage.removeItem('auth_token');
}

/**
 * Get the current authenticated user.
 * @returns {Promise<object|null>}
 */
export async function getCurrentUser() {
  try {
    return await api.get('/auth/me');
  } catch {
    return null;
  }
}

/**
 * Check if there is a stored auth token.
 */
export function hasStoredToken() {
  return !!localStorage.getItem('auth_token');
}
