import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

/**
 * Splash/landing screen — shown to unauthenticated users.
 * Directs users to the GitHub OAuth login flow.
 */
export default function SplashScreen() {
  const { login } = useAuth();

  return (
    <div className="fixed inset-0 flex items-center justify-center splash-gradient">
      <div className="w-full max-w-md mx-4 p-8 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl text-center">
        <div className="mb-2">
          <img src="/favicon.png" alt="README Forge Logo" className="w-16 h-16 mx-auto mb-3 object-contain rounded-xl shadow-md" />
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">README Forge</h1>
          <p className="text-gray-500 mt-2">Build a stunning GitHub profile README in minutes</p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => login('/')}
            className="w-full mt-2 py-3 rounded-lg font-semibold text-white bg-gray-900 hover:bg-gray-800 shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3-.404c1.02.005 2.047.138 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .32.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>
          <p className="text-xs text-gray-400 mt-4">
            We only request read access to your public profile.
          </p>
        </div>
      </div>
    </div>
  );
}
