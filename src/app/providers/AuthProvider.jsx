import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

/**
 * Auth context provider.
 * Phase 1: API key lives on the server — users are always "authenticated" for generation.
 * Phase 4: Wired to real JWT-based authentication for per-user features.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // With the API key on the server, users can always use the app.
  // When real auth is implemented, this will check for a valid JWT session.
  const isAuthenticated = useMemo(() => true, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      // Phase 4: Call auth service here
      // const { token, user } = await authService.login(credentials);
      // localStorage.setItem('auth_token', token);
      // setUser(user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_token');
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [user, isAuthenticated, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthProvider;
