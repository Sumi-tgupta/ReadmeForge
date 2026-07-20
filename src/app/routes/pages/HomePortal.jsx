import React, { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../providers/ThemeProvider';
import {
  ArrowRight, Github, Sun, Moon, Menu, X, Sparkles,
  Check, ChevronDown, Terminal, Cpu, Monitor,
  Settings, ShieldCheck, User, LogOut, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import useSEO from '../../../hooks/useSEO';

// Extracted memoized section sub-components
import { ProductsSection } from './home/ProductsSection';
import { FeaturesSection } from './home/FeaturesSection';
import { FAQSection } from './home/FAQSection';
import { PricingSection } from './home/PricingSection';

// Page fade-in transitions
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

// ─── Interactive Hero Mockup ────────────────────────────────────────────────

/**
 * Memoized animated mockup panel in the hero section.
 * Isolated here so its internal state (mockupStep, mockupText) never causes
 * the Navbar or any other section to re-render.
 */
const HeroMockup = memo(function HeroMockup() {
  const [mockupStep, setMockupStep] = useState(0);
  const [mockupText, setMockupText] = useState('');
  const [demoResetCount, setDemoResetCount] = useState(0);

  useEffect(() => {
    let timer;
    if (mockupStep === 0) {
      const fullText = 'https://github.com/Sumi-tgupta/ReadmeForge';
      let index = 0;
      setMockupText('');
      const type = () => {
        if (index < fullText.length) {
          setMockupText(prev => prev + fullText.charAt(index));
          index++;
          timer = setTimeout(type, 70);
        } else {
          timer = setTimeout(() => setMockupStep(1), 1000);
        }
      };
      timer = setTimeout(type, 500);
    } else if (mockupStep === 1) {
      timer = setTimeout(() => setMockupStep(2), 2000);
    } else if (mockupStep === 2) {
      timer = setTimeout(() => setMockupStep(3), 2000);
    } else if (mockupStep === 3) {
      timer = setTimeout(() => setMockupStep(0), 6000);
    }
    return () => clearTimeout(timer);
  }, [mockupStep, demoResetCount]);

  const triggerDemo = () => {
    setMockupStep(0);
    setDemoResetCount(prev => prev + 1);
  };

  return (
    <div className="md:col-span-6">
      <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800/80 bg-[#F6F8FA]/60 dark:bg-[#161B22]/60 backdrop-blur-md overflow-hidden shadow-2xl transition-colors duration-300">
        {/* Browser chrome */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-[#F6F8FA] dark:bg-[#161B22] transition-colors duration-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/60" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white dark:bg-[#0D1117] border border-gray-200 dark:border-gray-800 text-[11px] font-mono text-gray-600 dark:text-gray-400 w-64 md:w-80 transition-colors duration-300">
            <Monitor className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
            <span className="truncate">{mockupText || ' '}</span>
            <span className="w-1 h-3.5 bg-gray-500 dark:bg-white animate-pulse" />
          </div>
          <div className="w-12" />
        </div>

        {/* Content area */}
        <div className="p-6 min-h-[300px] flex flex-col font-mono text-xs select-none bg-white dark:bg-[#0D1117] transition-colors duration-300">
          <AnimatePresence mode="wait">
            {mockupStep === 0 && (
              <motion.div key="step-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 text-left">
                <div className="text-gray-650 dark:text-gray-400 flex items-center gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">$</span> git-scanner --analyze
                </div>
                <div className="text-gray-500 dark:text-gray-500">
                  Ready to analyze. Click "View Demo" to replay simulation.
                </div>
              </motion.div>
            )}

            {mockupStep === 1 && (
              <motion.div key="step-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3 text-left">
                <div className="text-gray-650 dark:text-gray-400 flex items-center gap-2">
                  <span className="text-indigo-650 dark:text-indigo-400">$</span> git-scanner --analyze
                </div>
                <div className="text-gray-800 dark:text-gray-300 flex items-center gap-2 animate-pulse font-bold">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Scanning remote repository branches...
                </div>
                <div className="space-y-1.5 pl-4 text-gray-600 dark:text-gray-450">
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> package.json identified</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> Framework: React 19 / Vite detected</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> Style framework: Tailwind CSS identified</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> License: MIT detected</div>
                </div>
              </motion.div>
            )}

            {mockupStep === 2 && (
              <motion.div key="step-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 flex flex-col justify-center items-center h-48">
                <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                <div className="text-gray-700 dark:text-gray-300 animate-pulse">AI Agent generating professional README.md...</div>
                <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="relative w-full h-full bg-indigo-600 dark:bg-indigo-450"
                  />
                </div>
              </motion.div>
            )}

            {mockupStep === 3 && (
              <motion.div key="step-3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4 font-sans text-left border border-gray-200 dark:border-gray-800 rounded-xl p-5 bg-gray-50 dark:bg-gray-900 h-64 overflow-y-auto shadow-inner transition-colors duration-300">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2 text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                  <span>README.md preview (generated)</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">100% optimized</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-1">ReadmeForge — AI README Builder</h2>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-450 border border-green-200 dark:border-green-800/40">build: passing</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-450 border border-indigo-200 dark:border-indigo-800/40">license: MIT</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  ReadmeForge is a developer-centric SaaS application designed to help teams assemble clean, visually rich, and modern profile or project documentation.
                </p>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">🚀 Features</h3>
                <ul className="text-xs text-gray-650 dark:text-gray-400 list-disc list-inside space-y-1">
                  <li>Server-side AI Gateway with caching.</li>
                  <li>Prompt compression and fallback tiers.</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Demo replay button below mockup */}
      <button
        onClick={triggerDemo}
        className="mt-3 mx-auto flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        ↺ Replay demo
      </button>
    </div>
  );
});

// ─── How It Works Section ────────────────────────────────────────────────────

const HowItWorksSection = memo(function HowItWorksSection() {
  const steps = [
    { step: '01', title: 'Choose Builder', desc: 'Select between the step-by-step Profile wizard or Project repo scanner.' },
    { step: '02', title: 'Provide Info', desc: 'Input your developer details or provide the link to a public GitHub repository.' },
    { step: '03', title: 'AI Generation', desc: 'The Express API gateway optimizes inputs and calls the Gemini API model chain.' },
    { step: '04', title: 'Download README', desc: 'Preview, format, copy, or download your optimized README.md documentation.' },
  ];

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">How It Works</h2>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">Get your generated file in four simple steps.</p>
      </div>
      <div className="grid md:grid-cols-4 gap-8 relative max-w-6xl mx-auto">
        <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[1px] bg-gray-200 dark:bg-gray-850 z-0" />
        {steps.map((item, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-bold text-indigo-650 dark:text-indigo-400 flex items-center justify-center shadow-sm transition-colors duration-300">
              {item.step}
            </div>
            <h3 className="text-base font-bold text-gray-950 dark:text-white pt-1">{item.title}</h3>
            <p className="text-gray-650 dark:text-gray-400 text-xs leading-relaxed max-w-[200px]">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
});

// ─── Preview Section ─────────────────────────────────────────────────────────

const PreviewSection = memo(function PreviewSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">Modern Markdown Previewing</h2>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">Beautiful renders matching GitHub container styles.</p>
      </div>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-900/40 p-4 max-w-5xl mx-auto overflow-hidden shadow-xl transition-colors duration-300">
        <div className="flex items-center gap-1.5 pb-3 border-b border-gray-200 dark:border-gray-800 px-2">
          <span className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/60" />
        </div>
        <div className="grid md:grid-cols-12 min-h-[380px] bg-white dark:bg-gray-950 transition-colors duration-300">
          <div className="md:col-span-4 p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 space-y-6 text-left bg-white dark:bg-gray-950">
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Preview Options</div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Visual Customization</h4>
            </div>
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs space-y-1">
                <div className="font-semibold text-gray-950 dark:text-white">Skill Icons Support</div>
                <div className="text-gray-600 dark:text-gray-400">Generate shields.io badges or skillicons.dev tiles.</div>
              </div>
              <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs space-y-1">
                <div className="font-semibold text-gray-950 dark:text-white">Trophies &amp; Streaks</div>
                <div className="text-gray-600 dark:text-gray-400">Live GitHub trophies and streak tracking widgets.</div>
              </div>
            </div>
          </div>
          <div className="md:col-span-8 p-6 flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
            <div className="w-full max-w-md p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl space-y-4 font-sans text-left transition-colors duration-300">
              <div className="flex items-center justify-between border-b border-gray-250 dark:border-gray-800 pb-2">
                <span className="text-xs font-bold text-gray-900 dark:text-white">Profile stats card</span>
                <span className="text-[10px] text-green-600 dark:text-green-450 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping" /> Live
                </span>
              </div>
              <div className="space-y-2">
                {[['Total Stars:', '412'], ['Total Commits:', '1,824'], ['PRs Merged:', '153']].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{label}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HomePortal() {
  const { isDark, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  useSEO({
    title: 'AI GitHub Profile & Project README Builder',
    description: 'Transform your GitHub presence with professional, custom READMEs powered by Gemini AI and automated repository scanning.',
    canonical: 'https://forge-readme.vercel.app/',
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#E2DFD2] dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-600 transition-colors duration-300"
    >
      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/40 dark:border-gray-800/45 bg-white/40 dark:bg-gray-950/40 backdrop-blur-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/15 group-hover:scale-105 transition-all duration-300">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-gray-950 dark:from-white to-gray-500 dark:to-gray-400 bg-clip-text text-transparent">
              README<span className="text-indigo-600 dark:text-indigo-400 ml-0.5">Forge</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <a href="#products" className="hover:text-black dark:hover:text-white transition-colors duration-200">Products</a>
            <a href="#features" className="hover:text-black dark:hover:text-white transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="hover:text-black dark:hover:text-white transition-colors duration-200">How it Works</a>
            <a href="#pricing" className="hover:text-black dark:hover:text-white transition-colors duration-200">Pricing</a>
            <a href="#faq" className="hover:text-black dark:hover:text-white transition-colors duration-200">FAQ</a>
            <a href="https://github.com/Sumi-tgupta/ReadmeForge" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors duration-200">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-gray-650 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-200" aria-label="Toggle Theme">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1.5 focus:outline-none" aria-label="User Profile Dropdown">
                  <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" />
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className={`absolute right-0 mt-2.5 w-48 rounded-2xl border p-2.5 shadow-xl z-20 space-y-1 ${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-850'}`}>
                      <div className="px-2 py-1.5 border-b border-gray-200 dark:border-gray-800 mb-1.5 text-left">
                        <p className="text-xs font-bold truncate">{user.displayName || user.username}</p>
                        <p className="text-[9px] text-gray-500 truncate">@{user.username}</p>
                      </div>
                      <a href={user.profileUrl} target="_blank" rel="noreferrer" onClick={() => setDropdownOpen(false)} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold w-full transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-650'}`}>
                        <Github className="w-3.5 h-3.5" /> GitHub Profile
                      </a>
                      <button onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold w-full text-left transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-650'}`}>
                        <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                      </button>
                      <div className="border-t border-gray-200 dark:border-gray-800 my-1 pt-1" />
                      <button onClick={() => { setDropdownOpen(false); logout(); }} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold w-full text-left text-red-500 hover:bg-red-500/5 transition-colors">
                        <LogOut className="w-3.5 h-3.5" /> Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => login()} className={`px-4 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all duration-200 ${isDark ? 'border-gray-800 bg-gray-900 hover:bg-gray-850 hover:text-white text-gray-300 shadow-md' : 'border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-950 text-gray-600 shadow-sm'}`}>
                  <Github className="w-4 h-4" /> Continue with GitHub
                </button>
                <Link to="/profile-builder" className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-650 hover:bg-indigo-700 dark:bg-indigo-550 dark:hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  Start Building
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400" aria-label="Toggle Theme">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-650 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" aria-label="Toggle Mobile Menu">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="md:hidden fixed top-16 left-0 right-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-6 z-40 space-y-4 shadow-lg transition-colors duration-300">
            <nav className="flex flex-col gap-4 text-base font-medium text-gray-655 dark:text-gray-400">
              <a href="#products" onClick={() => setMobileMenuOpen(false)} className="hover:text-black dark:hover:text-white">Products</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-black dark:hover:text-white">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-black dark:hover:text-white">How it Works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-black dark:hover:text-white">Pricing</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-black dark:hover:text-white">FAQ</a>
              <a href="https://github.com/Sumi-tgupta/ReadmeForge" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-black dark:hover:text-white">
                <Github className="w-4 h-4" /> GitHub
              </a>
            </nav>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-center w-full px-4 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 text-white dark:bg-indigo-500">Dashboard</Link>
                  <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="block text-center w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500">Log Out</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setMobileMenuOpen(false); login(); }} className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                    <Github className="w-4 h-4" /> Continue with GitHub
                  </button>
                  <Link to="/profile-builder" onClick={() => setMobileMenuOpen(false)} className="block text-center w-full px-4 py-2.5 text-sm font-semibold rounded-xl bg-indigo-650 text-white dark:bg-indigo-550">Start Building</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-12 gap-12 items-center">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

        <div className="md:col-span-6 space-y-6 text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-950 dark:text-white">
            Forge Beautiful <br />
            GitHub <span className="bg-gradient-to-r from-indigo-650 to-purple-650 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">READMEs</span> with AI
          </h1>
          <p className="text-gray-650 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg">
            Generate professional GitHub Profile and Project README files in minutes using intelligent repository analysis and AI-assisted writing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link to="/profile-builder" className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">
              Start Building <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#products" className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
              View Products
            </a>
          </div>
        </div>

        {/* Memoized mockup — isolated state */}
        <HeroMockup />
      </section>

      {/* ── Sections (all memoized) ── */}
      <ProductsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PreviewSection />
      <PricingSection />
      <FAQSection />

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-650 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-gray-950 dark:text-white">
              README<span className="text-indigo-650 dark:text-indigo-400">Forge</span>
            </span>
          </div>
          <div className="flex items-center gap-8 text-xs text-gray-600 dark:text-gray-400">
            <a href="https://github.com/Sumi-tgupta/ReadmeForge" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white">GitHub</a>
            <span className="cursor-pointer hover:text-black dark:hover:text-white">Privacy</span>
            <span className="cursor-pointer hover:text-black dark:hover:text-white">Terms</span>
            <span className="cursor-pointer hover:text-black dark:hover:text-white">Contact</span>
          </div>
          <div className="text-right text-[11px] text-gray-500 dark:text-gray-400">
            <div>© {new Date().getFullYear()} README Forge. All rights reserved.</div>
            <div className="opacity-50 mt-1">v1.1.0 (Developer Beta)</div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
