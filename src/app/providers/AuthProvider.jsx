/**
 * ⚠️  DEPRECATED STUB — DO NOT USE DIRECTLY
 *
 * This file previously contained a stub AuthProvider where isAuthenticated was
 * hardcoded to `true`, allowing any user to bypass authentication entirely.
 *
 * It now safely re-exports the real AuthProvider and useAuth from:
 *   src/features/auth/AuthProvider.jsx
 *
 * All new imports should point directly to that path.
 */
export { AuthProvider, default } from '../../features/auth/AuthProvider';
export { useAuth } from '../../features/auth/AuthContext';
