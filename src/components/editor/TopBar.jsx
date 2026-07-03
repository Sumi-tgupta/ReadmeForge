import React from 'react';
import { Sparkles, Sun, Moon, Settings, Terminal } from 'lucide-react';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useGenerator } from '../../hooks/useGenerator';

/**
 * Top navigation bar with progress indicator, theme toggle, and settings.
 */
export default function TopBar() {
  const { vc, isDark, toggleTheme } = useTheme();
  const { steps, currentStepIndex, setSettingsOpen } = useGenerator();

  const totalSteps = steps.length;
  const displayStepNum = currentStepIndex + 1;

  return (
    <div className={`sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b ${vc.surface} backdrop-blur-md`}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Terminal className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-sm bg-gradient-to-r from-gray-950 dark:from-white to-gray-500 dark:to-gray-400 bg-clip-text text-transparent">
          README<span className="text-indigo-600 dark:text-indigo-400 ml-0.5">Forge</span>
        </span>
      </div>

      {/* Desktop Progress Tracker */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i < displayStepNum ? vc.progress : isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <span className={`text-xs whitespace-nowrap ${vc.textSec}`}>
            Step {displayStepNum} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Mobile simplified Progress Indicator */}
      <div className="sm:hidden flex-1 flex justify-center">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded bg-gray-150/70 dark:bg-gray-800/80 ${vc.textSec}`}>
          {displayStepNum} / {totalSteps}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all hover:opacity-70 ${vc.text}`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
