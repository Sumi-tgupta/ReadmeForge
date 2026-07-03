import React, { useEffect, useRef } from 'react';
import { Github, X, ShieldAlert, Terminal } from 'lucide-react';
import { useTheme } from '../../app/providers/ThemeProvider';
import GitHubButton from './GitHubButton';

export default function LoginModal({ onClose, onConfirm }) {
  const { vc, isDark } = useTheme();
  const modalRef = useRef(null);

  // Close on ESC keypress
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus trap for accessibility
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element initially
    firstElement?.focus();

    const handleTabTrap = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    modal.addEventListener('keydown', handleTabTrap);
    return () => modal.removeEventListener('keydown', handleTabTrap);
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className={`max-w-md w-full rounded-2xl border p-6 shadow-2xl animate-fade-in relative flex flex-col items-center text-center ${
          isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4.5 right-4.5 p-1.5 rounded-lg text-gray-400 hover:text-gray-650 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* README Forge Logo */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-4 shadow-md select-none">
          <Terminal className="w-6.5 h-6.5 text-white" />
        </div>

        <h3 id="modal-title" className="text-lg font-bold mb-1.5">Continue with GitHub</h3>
        <p className={`text-xs leading-relaxed max-w-sm mb-6 ${vc.textSec}`}>
          Login is required to generate, save and manage your README projects.
        </p>

        {/* GitHub Button */}
        <div className="w-full space-y-3">
          <GitHubButton onClick={onConfirm} />
          
          <button
            onClick={onClose}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              isDark 
                ? 'border-gray-850 hover:bg-gray-800 text-gray-300' 
                : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-sm'
            }`}
          >
            Cancel
          </button>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-1.5 mt-5 text-[10px] text-gray-500">
          <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
          <span>We only request the minimum permissions required.</span>
        </div>
      </div>
    </div>
  );
}
