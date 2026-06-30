import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { authApi } from '../../services/authApi';
import { useToast } from '../../app/providers/ToastProvider';
import LoginModal from './LoginModal';

export function AuthProvider({ children }) {
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Load user profile details
  const refreshUser = useCallback(async () => {
    try {
      const data = await authApi.getCurrentUser();
      setUser(data.user);
      return data.user;
    } catch (_) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initiate GitHub OAuth redirect
  const login = useCallback(async (redirectPath = window.location.pathname) => {
    try {
      const data = await authApi.getLoginUrl(redirectPath);
      if (data.url) {
        // Redirect browser to GitHub
        window.location.href = data.url;
      }
    } catch (err) {
      showToast('OAuth initialization failed');
    }
  }, [showToast]);

  // Terminate session
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      setUser(null);
      showToast('Logged out successfully');
      window.location.href = '/';
    } catch (err) {
      showToast('Logout failed');
    }
  }, [showToast]);

  const isAuthenticated = useCallback(() => {
    return user !== null;
  }, [user]);

  // Securely trigger actions (like generation) that require authentication
  const executeWithAuth = useCallback((actionFn, description = 'perform this action') => {
    if (user) {
      actionFn();
      return;
    }

    // Set callback to run after successful login
    setPendingAction(() => actionFn);
    
    // Save pending state in sessionStorage to survive OAuth redirect
    window.sessionStorage.setItem('readme_forge_pending_action', 'true');
    window.sessionStorage.setItem('readme_forge_pending_desc', description);

    // Open login modal
    setIsLoginModalOpen(true);
  }, [user]);

  // Check login success query params and initial session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const currentUser = await refreshUser();
      
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') === 'success') {
        // Clean URL query params without reloading page
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);

        if (currentUser) {
          showToast(`Welcome back, ${currentUser.displayName || currentUser.username}!`);
          
          // Check if there was a pending action before redirect
          const wasPending = window.sessionStorage.getItem('readme_forge_pending_action') === 'true';
          if (wasPending) {
            window.sessionStorage.removeItem('readme_forge_pending_action');
            const desc = window.sessionStorage.getItem('readme_forge_pending_desc') || '';
            window.sessionStorage.removeItem('readme_forge_pending_desc');
            
            showToast(`Resuming ${desc}...`);
            
            // Force a custom event or a small timeout to let builders catch it
            const event = new CustomEvent('readme_forge_resume_generation');
            window.dispatchEvent(event);
          }
        }
      }
    };

    initializeAuth();
  }, [refreshUser, showToast]);

  const value = useMemo(() => ({
    user,
    setUser,
    loading,
    login,
    logout,
    isAuthenticated,
    refreshUser,
    executeWithAuth,
    openLoginModal: (callback) => {
      setPendingAction(() => callback);
      setIsLoginModalOpen(true);
    },
    closeLoginModal: () => setIsLoginModalOpen(false)
  }), [user, loading, login, logout, isAuthenticated, refreshUser, executeWithAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      {isLoginModalOpen && (
        <LoginModal 
          onClose={() => setIsLoginModalOpen(false)} 
          onConfirm={() => {
            // Save builder inputs before redirect
            const desc = window.sessionStorage.getItem('readme_forge_pending_desc') || 'generate';
            login(window.location.pathname);
          }} 
        />
      )}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
