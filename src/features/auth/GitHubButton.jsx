import React from 'react';
import { Github } from 'lucide-react';

export default function GitHubButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#24292F] hover:bg-[#24292F]/90 text-white transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
    >
      <Github className="w-4 h-4 text-white" />
      Continue with GitHub
    </button>
  );
}
