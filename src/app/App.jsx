import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';
import { AuthProvider } from './providers/AuthProvider';
import ErrorBoundary from '../components/common/ErrorBoundary';
import EditorPage from './routes/EditorPage';

/**
 * Root App component — wraps everything in providers.
 * Routing is minimal in Phase 1 (just editor), expands in Phase 4.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<EditorPage />} />
                {/* Phase 4: Add these routes */}
                {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
                {/* <Route path="/auth" element={<AuthPage />} /> */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
