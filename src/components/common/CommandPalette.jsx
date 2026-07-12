import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Folder, Settings, Moon, Sun, LogOut, Terminal } from 'lucide-react';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';

/**
 * Premium keyboard-navigable Command Palette (Ctrl+K).
 * Implements modern developer SaaS UI look-and-feel.
 */
export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { vc, isDark, setTheme, setVibe, vibe } = useTheme();
  const { user, logout } = useAuth();
  const authenticated = Boolean(user);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Toggle Command Palette on Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset selected item when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearch('');
    }
  }, [isOpen]);

  const items = [
    {
      id: 'profile',
      title: 'New Profile README',
      subtitle: 'Build a custom README using the Layout Wizard',
      icon: Sparkles,
      action: () => { navigate('/profile-builder'); setIsOpen(false); }
    },
    {
      id: 'project',
      title: 'New Project README',
      subtitle: 'Scan a GitHub repository and generate stacks documentation',
      icon: Terminal,
      action: () => { navigate('/project-builder'); setIsOpen(false); }
    },
    ...(authenticated ? [
      {
        id: 'dashboard',
        title: 'Open Dashboard',
        subtitle: 'View generation statistics and recent projects',
        icon: Folder,
        action: () => { navigate('/dashboard'); setIsOpen(false); }
      },
      {
        id: 'projects',
        title: 'Open Saved Projects',
        subtitle: 'Manage your previously generated templates',
        icon: Folder,
        action: () => { navigate('/my-projects'); setIsOpen(false); }
      }
    ] : []),
    {
      id: 'settings',
      title: 'Open Settings',
      subtitle: 'Configure vibes, themes, and size configurations',
      icon: Settings,
      action: () => { navigate('/settings'); setIsOpen(false); }
    },
    {
      id: 'theme',
      title: `Toggle Theme (Current: ${isDark ? 'Dark' : 'Light'})`,
      subtitle: 'Switch application color theme mode',
      icon: isDark ? Sun : Moon,
      action: () => { setTheme(isDark ? 'light' : 'dark'); }
    },
    {
      id: 'vibe',
      title: `Cycle UI Vibe (Current: ${vibe})`,
      subtitle: 'Toggle theme styles between minimal, bold, and github',
      icon: Terminal,
      action: () => {
        const vibes = ['minimal', 'bold', 'github'];
        const nextIdx = (vibes.indexOf(vibe) + 1) % vibes.length;
        setVibe(vibes[nextIdx]);
      }
    },
    ...(authenticated ? [
      {
        id: 'logout',
        title: 'Logout',
        subtitle: 'Terminate active session safely',
        icon: LogOut,
        action: () => { logout(); setIsOpen(false); }
      }
    ] : [])
  ];

  // Filter list based on search
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  // Handle keyboard navigation inside the palette
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Keyboard shortcut indicator floating in top corner for premium UI feel */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg text-xs font-semibold text-gray-500 dark:text-gray-400 backdrop-blur-md select-none pointer-events-none">
        <span>Press</span>
        <kbd className="px-1.5 py-0.5 bg-gray-150 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-[10px]">Ctrl</kbd>
        <span>+</span>
        <kbd className="px-1.5 py-0.5 bg-gray-150 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-[10px]">K</kbd>
        <span>for Command Palette</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            />

            {/* Palette Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-xl mx-4 bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-850 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              {/* Search Bar */}
              <div className="flex items-center gap-3 px-4 border-b border-gray-150 dark:border-gray-800">
                <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search actions..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full py-4 bg-transparent outline-none border-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800/80 px-2 py-1 rounded">
                  ESC
                </span>
              </div>

              {/* Items List */}
              <div className="max-h-[360px] overflow-y-auto p-2 scrollbar-thin">
                {filteredItems.length === 0 ? (
                  <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500 font-medium">
                    No commands found matching "{search}"
                  </div>
                ) : (
                  filteredItems.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left flex items-start gap-3.5 px-4 py-3.5 rounded-xl transition-colors ${
                          isSelected
                            ? 'bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isSelected ? 'text-indigo-500' : 'text-gray-400'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{item.title}</div>
                          <div className={`text-xs truncate ${isSelected ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                            {item.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
              
              {/* Footer navigation cues */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-950 border-t border-gray-150 dark:border-gray-800 text-[10px] font-semibold text-gray-400 dark:text-gray-500 select-none">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow-sm">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow-sm">Enter</kbd>
                    Select
                  </span>
                </div>
                <span>README Forge Palette v1.0</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
