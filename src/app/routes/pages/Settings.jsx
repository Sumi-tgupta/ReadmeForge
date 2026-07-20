import React from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useSEO from '../../../hooks/useSEO';

// Page transitions definition
const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.18, ease: 'easeIn' } }
};

export default function Settings() {
  const { vc, isDark, theme, setTheme, builderStyle, setBuilderStyle } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useSEO({
    title: 'Preferences Settings',
    description: 'Customize application theme, builders interface layout style, and diagnostic settings.'
  });

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    showToast(`Theme changed to ${newTheme}`);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-screen ${isDark ? 'bg-gray-955' : 'bg-[#E2DFD2]'} ${vc.text} flex flex-col`}
    >
      {/* Sub Header */}
      <div className={`border-b px-6 py-4 flex items-center justify-between ${
        isDark ? 'border-white/5 bg-gray-900/50' : 'border-gray-200 bg-white/60'
      }`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className={`p-2 rounded-lg border transition-colors ${
              isDark ? 'border-white/5 bg-gray-900 text-gray-400 hover:text-white' : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Clickable Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-650 flex items-center justify-center shadow-lg shadow-indigo-500/15 group-hover:scale-105 transition-all duration-300">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-gray-950 dark:from-white to-gray-500 dark:to-gray-400 bg-clip-text text-transparent hidden sm:block">
              README<span className="text-indigo-600 dark:text-indigo-400 ml-0.5">Forge</span>
            </span>
          </Link>

          <div className={`h-5 w-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'} hidden sm:block`} />

          <div className="text-left hidden sm:block">
            <h1 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              System Settings
            </h1>
          </div>
        </div>
      </div>

      {/* Content centered layout */}
      <div className="flex-1 max-w-xl w-full mx-auto px-6 py-12 space-y-6">
        
        {/* Interface Options */}
        <div className={`p-6 rounded-2xl border space-y-4 text-left ${
          isDark ? 'border-white/5 bg-gray-900/40' : 'border-gray-200 bg-white shadow-sm'
        }`}>
          <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Interface Options
          </h2>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Active Vibe / Design Theme</span>
              <div className="grid grid-cols-3 gap-2">
                {['light', 'dark', 'system'].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`py-2 text-[10px] uppercase font-bold rounded-lg border transition-all ${
                      theme === t 
                        ? 'bg-indigo-500/15 text-indigo-500 border-indigo-500/25' 
                        : isDark
                          ? 'bg-gray-900 border-white/5 text-gray-400 hover:text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className={`space-y-1 pt-3 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
              <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Builder Style</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'classic', label: 'Classic Wizard' },
                  { id: 'conversation', label: 'Conversation' }
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setBuilderStyle(style.id);
                      showToast(`Builder style set to ${style.label}`);
                    }}
                    className={`py-2 text-[10px] uppercase font-bold rounded-lg border transition-all ${
                      builderStyle === style.id 
                        ? 'bg-indigo-500/15 text-indigo-500 border-indigo-500/25' 
                        : isDark
                          ? 'bg-gray-900 border-white/5 text-gray-400 hover:text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Database Details */}
        <div className={`p-6 rounded-2xl border space-y-3 text-xs text-left ${
          isDark ? 'border-white/5 bg-gray-900/40 text-gray-400' : 'border-gray-200 bg-white text-gray-500 shadow-sm'
        }`}>
          <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Database Details
          </h2>
          <div className={`flex justify-between py-1.5 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
            <span>Provider:</span>
            <span className={`font-semibold font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>Supabase (PostgreSQL)</span>
          </div>
          <div className={`flex justify-between py-1.5 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
            <span>Tables:</span>
            <span className={`font-semibold font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>users, projects, sessions, generation_history</span>
          </div>
          <p className="text-[10px] leading-relaxed pt-2">
            Supabase (PostgreSQL) stores user profiles, saved projects, session tokens, and generation usage logs.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
