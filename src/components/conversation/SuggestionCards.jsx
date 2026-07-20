import React from 'react';
import { User, Terminal, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useNavigate } from 'react-router-dom';

export default React.memo(function SuggestionCards({ onSelectAction }) {
  const { vc, isDark } = useTheme();
  const navigate = useNavigate();

  const cards = [
    {
      id: 'profile',
      title: 'Build a professional profile',
      description: 'Create a visually rich personal README with stats, tools, and social links.',
      icon: User,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      action: () => onSelectAction('profile')
    },
    {
      id: 'project',
      title: 'Create a project README',
      description: 'Scan your public GitHub repo and generate structure, badge guidelines, and docs.',
      icon: Terminal,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      action: () => navigate('/project-builder/chat')
    },
    {
      id: 'scratch',
      title: 'Start from scratch',
      description: 'Begin entering your profile data directly step-by-step.',
      icon: Sparkles,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      action: () => onSelectAction('profile')
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 max-w-2xl w-full">
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <button
            key={c.id}
            onClick={c.action}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 ${
              isDark 
                ? 'bg-gray-900 border-gray-800 hover:bg-gray-805 hover:border-gray-700' 
                : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
            }`}
          >
            <div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-4 ${c.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {c.title}
              </h3>
              <p className={`text-xs leading-relaxed mb-4 ${vc.textSec}`}>
                {c.description}
              </p>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${vc.accent}`}>
              Get started <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        );
      })}
    </div>
  );
});

