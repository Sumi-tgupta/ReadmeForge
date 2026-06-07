import React, { useState } from 'react';
import { Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';

/**
 * Splash/landing screen — shown when no API key is configured.
 * In Phase 4 this becomes the login redirect.
 */
export default function SplashScreen() {
  const { setApiKey } = useAuth();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleStart = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center splash-gradient">
      <div className="w-full max-w-md mx-4 p-8 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl text-center">
        <div className="mb-2">
          <img src="/favicon.png" alt="README Forge Logo" className="w-16 h-16 mx-auto mb-3 object-contain rounded-xl shadow-md" />
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">README Forge</h1>
          <p className="text-gray-500 mt-2">Build a stunning GitHub profile README in minutes</p>
        </div>

        <div className="mt-8 text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Enter your Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              placeholder="AIza..."
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              onKeyDown={e => { if (e.key === 'Enter') handleStart(); }}
            />
            <button
              onClick={() => setShowKey(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Your key is never stored or sent anywhere except directly to Google's API.{' '}
            Get a free key at{' '}
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline hover:text-indigo-700"
            >
              aistudio.google.com
            </a>
          </p>
        </div>

        <button
          onClick={handleStart}
          disabled={!apiKeyInput.trim()}
          className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition-all active:scale-95 ${
            apiKeyInput.trim()
              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Start Building <ArrowRight className="w-4 h-4 inline ml-1" />
        </button>
      </div>
    </div>
  );
}
