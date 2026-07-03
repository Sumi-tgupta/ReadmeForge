import React from 'react';
import { AlertCircle, FolderOpen, Search, ShieldAlert, Cpu } from 'lucide-react';
import { useTheme } from '../../app/providers/ThemeProvider';

/**
 * Reusable UI Empty State component.
 * Includes icon, title, description, and an optional CTA button.
 */
export function EmptyState({
  icon: IconComponent = FolderOpen,
  title = 'No Data Found',
  description = 'There is nothing to display here yet.',
  actionLabel,
  onAction,
}) {
  const { vc } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
        <IconComponent className="w-7 h-7" />
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${vc.text}`}>
        {title}
      </h3>
      <p className={`text-sm mb-6 max-w-sm ${vc.textSec}`}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`px-4 py-2.5 rounded-lg text-sm transition-all ${vc.btn}`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * Reusable UI Error State component.
 * Displays user-friendly error diagnostics instead of raw logs.
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  errorType = 'generic', // 'network', 'github', 'gemini', 'auth', 'limit'
  actionLabel = 'Try Again',
  onAction,
}) {
  const { vc } = useTheme();

  const config = {
    generic: { icon: AlertCircle, color: 'text-amber-500' },
    network: { icon: ShieldAlert, color: 'text-red-500' },
    github: { icon: Cpu, color: 'text-blue-500' },
    gemini: { icon: Cpu, color: 'text-purple-500' },
    auth: { icon: ShieldAlert, color: 'text-rose-500' },
    limit: { icon: AlertCircle, color: 'text-orange-500' },
  }[errorType] || { icon: AlertCircle, color: 'text-amber-500' };

  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto rounded-2xl border border-red-100 dark:border-red-950/20 bg-red-50/10 dark:bg-red-950/5">
      <div className={`w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-4 ${config.color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${vc.text}`}>
        {title}
      </h3>
      <p className={`text-sm mb-6 ${vc.textSec}`}>
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${vc.btn}`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
