import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';
import { AuthProvider } from './providers/AuthProvider';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Lazy loading pages for code splitting & performance optimization
const HomePortal = lazy(() => import('./routes/pages/HomePortal'));
const ProfileBuilder = lazy(() => import('./routes/pages/ProfileBuilder'));
const ProjectBuilder = lazy(() => import('./routes/pages/ProjectBuilder'));
const Settings = lazy(() => import('./routes/pages/Settings'));
const NotFound = lazy(() => import('./routes/pages/NotFound'));

/**
 * Premium skeleton loader placeholder used during async page splits
 */
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col justify-center items-center gap-4 font-sans select-none">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
        <div className="absolute inset-0 border-4 border-t-[#5B8CFF] rounded-full animate-spin" />
      </div>
      <div className="text-xs font-semibold text-[#9CA3AF] tracking-wide animate-pulse">
        Initializing Document Engine...
      </div>
    </div>
  );
}

/**
 * Root App component — handles providers, layout wrappers, and lazy routes.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePortal />} />
                  <Route path="/profile-builder" element={<ProfileBuilder />} />
                  <Route path="/project-builder" element={<ProjectBuilder />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/not-found" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/not-found" replace />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
