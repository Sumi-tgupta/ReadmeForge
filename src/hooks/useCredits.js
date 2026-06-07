/**
 * Hook for managing user credits.
 * Phase 1: Returns static values (unlimited).
 * Phase 4: Wired to backend credit tracking.
 */
import { useState, useMemo } from 'react';

export function useCredits() {
  const [credits, setCredits] = useState(20);
  const [plan] = useState('free');

  const isUnlimited = plan === 'premium';
  const hasCredits = isUnlimited || credits > 0;

  const deductCredit = () => {
    if (!isUnlimited) {
      setCredits(prev => Math.max(0, prev - 1));
    }
  };

  return useMemo(() => ({
    credits,
    plan,
    isUnlimited,
    hasCredits,
    deductCredit,
  }), [credits, plan, isUnlimited, hasCredits]);
}

export default useCredits;
