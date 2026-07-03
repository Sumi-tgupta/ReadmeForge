import React from 'react';

/**
 * Reusable UI skeleton loader primitive with animated shimmer/pulse.
 * Excellent for building custom, context-aware loading states.
 */
export function Skeleton({ className = '', variant = 'text', ...props }) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-800 animate-pulse';
  
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg w-full h-32',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant] || ''} ${className}`}
      {...props}
    />
  );
}

/**
 * Context-aware Repository Scanning skeleton placeholder
 */
export function RepositoryScanSkeleton() {
  return (
    <div className="space-y-4 p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/3 h-5" />
          <Skeleton variant="text" className="w-1/4 h-3.5" />
        </div>
      </div>
      <div className="space-y-3 pt-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-11/12" />
        <Skeleton variant="text" className="w-4/5" />
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/80">
        <Skeleton variant="text" className="w-20 h-7" />
        <Skeleton variant="text" className="w-24 h-7" />
      </div>
    </div>
  );
}

/**
 * Context-aware Preview Loader skeleton placeholder
 */
export function PreviewShimmerLoader() {
  return (
    <div className="space-y-6 p-6 rounded-xl border border-gray-100 dark:border-gray-900/50 bg-gray-50/50 dark:bg-gray-950/20">
      <div className="space-y-2">
        <Skeleton variant="text" className="w-2/3 h-8" />
        <Skeleton variant="text" className="w-1/2 h-4" />
      </div>
      
      <div className="flex gap-2">
        <Skeleton variant="text" className="w-16 h-6 rounded-full" />
        <Skeleton variant="text" className="w-20 h-6 rounded-full" />
        <Skeleton variant="text" className="w-24 h-6 rounded-full" />
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-850">
        <div className="flex items-center gap-4">
          <Skeleton variant="rectangular" className="w-32 h-32 rounded-lg shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton variant="text" className="w-1/2 h-5" />
            <Skeleton variant="text" className="w-3/4 h-4" />
            <Skeleton variant="text" className="w-2/3 h-4" />
          </div>
        </div>
        
        <div className="space-y-3">
          <Skeleton variant="text" className="w-full" />
          <Skeleton variant="text" className="w-11/12" />
          <Skeleton variant="text" className="w-5/6" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
