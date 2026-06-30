import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../providers/ThemeProvider';
import { 
  ArrowRight, Github, Sun, Moon, Menu, X, BookOpen, 
  Layers, Zap, Download, Sparkles, Check, ChevronDown, 
  Terminal, Cpu, CheckCircle, Copy, Monitor, FileText, 
  Settings, ShieldAlert, ShieldCheck, User, LogOut, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';

// Page transitions definition
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }
};

export default function HomePortal() {
  const { theme, setTheme, isDark, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Interactive mockup state machine
  const [mockupStep, setMockupStep] = useState(0);
  const [mockupText, setMockupText] = useState('');
  
  // Custom interactive mockup simulation
  useEffect(() => {
    let timer;
    if (mockupStep === 0) {
      // Type URL
      let fullText = 'https://github.com/Sumi-tgupta/ReadmeForge';
      let index = 0;
      setMockupText('');
      
      const type = () => {
        if (index < fullText.length) {
          setMockupText(prev => prev + fullText.charAt(index));
          index++;
          timer = setTimeout(type, 70);
        } else {
          // Go to next step after typing is complete
          timer = setTimeout(() => setMockupStep(1), 1000);
        }
      };
      timer = setTimeout(type, 500);
      
    } else if (mockupStep === 1) {
      // Scanning
      timer = setTimeout(() => setMockupStep(2), 2000);
    } else if (mockupStep === 2) {
      // AI Processing
      timer = setTimeout(() => setMockupStep(3), 2000);
    } else if (mockupStep === 3) {
      // Result
      timer = setTimeout(() => setMockupStep(0), 6000);
    }
    
    return () => clearTimeout(timer);
  }, [mockupStep]);

  const triggerMockupDemo = () => {
    setMockupStep(0);
  };

  const faqs = [
    {
      q: 'How does the AI analyze my public GitHub repository?',
      a: 'README Forge scans the repository using public endpoints, reading metadata like programming languages, dependencies (e.g., package.json), and the file structure. It compiles this structure and sends it to the Gemini API to draft professional documentation.'
    },
    {
      q: 'Is my Google Gemini API key exposed in the browser?',
      a: 'No. All operations are routed through a server-side Express API gateway. Your API keys are strictly configured on the server, ensuring zero client-side exposure.'
    },
    {
      q: 'Can I customize the generated README before exporting?',
      a: 'Absolutely. The platform features a real-time Markdown preview editor. You can live-edit the generated markdown, switch between themes, and see changes instantly before copy/download.'
    },
    {
      q: 'Are generations cached to save token usage?',
      a: 'Yes, the backend implements a SHA-256 in-memory caching layer. Identical configurations or repository structures generate instantly from the cache, avoiding duplicate API calls.'
    }
  ];

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#E2DFD2] dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-600 transition-colors duration-300"
    >
      {/* Persistent Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/40 dark:border-gray-800/45 bg-white/40 dark:bg-gray-950/40 backdrop-blur-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/15 group-hover:scale-105 transition-all duration-300">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-gray-950 dark:from-white to-gray-500 dark:to-gray-400 bg-clip-text text-transparent">
              README<span className="text-indigo-600 dark:text-indigo-400 ml-0.5">Forge</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <a href="#products" className="hover:text-black dark:hover:text-white transition-colors duration-200">Products</a>
            <a href="#features" className="hover:text-black dark:hover:text-white transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="hover:text-black dark:hover:text-white transition-colors duration-200">How it Works</a>
            <a href="#faq" className="hover:text-black dark:hover:text-white transition-colors duration-200">FAQ</a>
            <a 
              href="https://github.com/Sumi-tgupta/ReadmeForge" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors duration-200"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-gray-650 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 focus:outline-none"
                  aria-label="User Profile Dropdown"
                >
                  <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" />
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>
                
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className={`absolute right-0 mt-2.5 w-48 rounded-2xl border p-2.5 shadow-xl z-20 space-y-1 ${
                      isDark ? 'bg-gray-900 border-gray-805 text-white' : 'bg-white border-gray-200 text-gray-850'
                    }`}>
                      <div className="px-2 py-1.5 border-b border-gray-200 dark:border-gray-800 mb-1.5 text-left">
                        <p className="text-xs font-bold truncate">{user.displayName || user.username}</p>
                        <p className="text-[9px] text-gray-500 truncate">@{user.username}</p>
                      </div>
                      
                      <a
                        href={user.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold w-full transition-colors ${
                          isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-650'
                        }`}
                      >
                        <Github className="w-3.5 h-3.5" /> GitHub Profile
                      </a>
                      
                      <button
                        onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold w-full text-left transition-colors ${
                          isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-650'
                        }`}
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                      </button>
                      
                      <button
                        onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold w-full text-left transition-colors ${
                          isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-650'
                        }`}
                      >
                        <Settings className="w-3.5 h-3.5" /> Settings
                      </button>
                      
                      <div className="border-t border-gray-200 dark:border-gray-800 my-1 pt-1" />
                      
                      <button
                        onClick={() => { setDropdownOpen(false); logout(); }}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold w-full text-left text-red-500 hover:bg-red-500/5 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => login()}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-800 bg-gray-900 hover:bg-gray-850 hover:text-white text-gray-300 shadow-md' 
                      : 'border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-950 text-gray-600 shadow-sm'
                  }`}
                >
                  <Github className="w-4 h-4" /> Continue with GitHub
                </button>
                <Link 
                  to="/profile-builder" 
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-650 hover:bg-indigo-700 dark:bg-indigo-550 dark:hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Start Building
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-650 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 right-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-6 z-40 space-y-4 shadow-lg transition-colors duration-300"
          >
            <nav className="flex flex-col gap-4 text-base font-medium text-gray-650 dark:text-gray-400">
              <a href="#products" onClick={() => setMobileMenuOpen(false)} className="hover:text-black dark:hover:text-white">Products</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-black dark:hover:text-white">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-black dark:hover:text-white">How it Works</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-black dark:hover:text-white">FAQ</a>
              <a 
                href="https://github.com/Sumi-tgupta/ReadmeForge" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 hover:text-black dark:hover:text-white"
              >
                <Github className="w-4.5 h-4.5" /> GitHub
              </a>
            </nav>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center w-full px-4 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 text-white dark:bg-indigo-500"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    className="block text-center w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); login(); }}
                    className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                  >
                    <Github className="w-4 h-4" /> Continue with GitHub
                  </button>
                  <Link 
                    to="/profile-builder" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center w-full px-4 py-2.5 text-sm font-semibold rounded-xl bg-indigo-650 text-white dark:bg-indigo-550"
                  >
                    Start Building
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-12 gap-12 items-center">
        {/* Glow Effects */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

        {/* Hero Left */}
        <div className="md:col-span-6 space-y-6 text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-950 dark:text-white">
            Forge Beautiful <br/>
            GitHub <span className="bg-gradient-to-r from-indigo-650 to-purple-650 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">READMEs</span> with AI
          </h1>
          <p className="text-gray-650 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg">
            Generate professional GitHub Profile and Project README files in minutes using intelligent repository analysis and AI-assisted writing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link 
              to="/profile-builder" 
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
            >
              Start Building <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={triggerMockupDemo} 
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              View Demo
            </button>
          </div>
        </div>

        {/* Hero Right - Interactive Mockup */}
        <div className="md:col-span-6">
          <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800/80 bg-[#F6F8FA]/60 dark:bg-[#161B22]/60 backdrop-blur-md overflow-hidden shadow-2xl transition-colors duration-300">
            {/* Browser Header Bar */}
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

            {/* Browser Content */}
            <div className="p-6 min-h-[300px] flex flex-col font-mono text-xs select-none bg-white dark:bg-[#0D1117] transition-colors duration-300">
              <AnimatePresence mode="wait">
                {/* Step 0: Inputting */}
                {mockupStep === 0 && (
                  <motion.div 
                    key="step-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 text-left"
                  >
                    <div className="text-gray-650 dark:text-gray-400 flex items-center gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">$</span> git-scanner --analyze
                    </div>
                    <div className="text-gray-500 dark:text-gray-500">Ready to analyze. Click "View Demo" to replay simulation.</div>
                  </motion.div>
                )}

                {/* Step 1: Scanning */}
                {mockupStep === 1 && (
                  <motion.div 
                    key="step-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3 text-left"
                  >
                    <div className="text-gray-655 dark:text-gray-400 flex items-center gap-2">
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

                {/* Step 2: Generating */}
                {mockupStep === 2 && (
                  <motion.div 
                    key="step-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 flex flex-col justify-center items-center h-48"
                  >
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

                {/* Step 3: Result Preview */}
                {mockupStep === 3 && (
                  <motion.div 
                    key="step-3"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 font-sans text-left border border-gray-200 dark:border-gray-800 rounded-xl p-5 bg-gray-50 dark:bg-gray-900 h-64 overflow-y-auto shadow-inner transition-colors duration-300"
                  >
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
        </div>
      </section>

      {/* Product Selector */}
      <section id="products" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">Choose Your Documentation Engine</h2>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            Select one of our specialized builder tools to construct developer assets.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div 
            onClick={() => navigate('/profile-builder')}
            className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 cursor-pointer shadow-sm hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:border-indigo-450/50 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-650 dark:text-indigo-400">
                <Monitor className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white transition-colors duration-200">GitHub Profile README</h3>
              <p className="text-gray-650 dark:text-gray-400 text-sm leading-relaxed">
                Create stunning profile READMEs using guided wizard inputs for work experience, hobbies, skills, trophies, and stats.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-650 dark:text-indigo-400 mt-8 group-hover:underline">
              Open Builder <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => navigate('/project-builder')}
            className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 cursor-pointer shadow-sm hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:border-indigo-450/50 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-650 dark:text-indigo-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white transition-colors duration-200">Project README Generator</h3>
              <p className="text-gray-655 dark:text-gray-400 text-sm leading-relaxed">
                Analyze any public GitHub repository, crawl its technology stack, and draft production-quality repo documentation automatically.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-650 dark:text-indigo-400 mt-8 group-hover:underline">
              Analyze Repository <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">Built for Modern Developer Workflows</h2>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            All the configurations, templates, and analytics to optimize your GitHub developer profile.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Cpu className="w-5 h-5" />,
              title: "Repository Intelligence",
              desc: "Scans repository layouts, folder maps, package.json dependencies, and licenses to write accurate, helpful summaries."
            },
            {
              icon: <FileText className="w-5 h-5" />,
              title: "Markdown Preview",
              desc: "Simulate a live, fully-styled GitHub dark/light mode markdown container to verify your README output matches the web."
            },
            {
              icon: <ShieldCheck className="w-5 h-5" />,
              title: "GitHub Ready",
              desc: "Uses certified styles, icons, badges, stats cards, and trophies that fit seamlessly into GitHub profile layouts."
            },
            {
              icon: <Copy className="w-5 h-5" />,
              title: "One-Click Copy",
              desc: "Instantly copy the generated markdown code block or export it directly to save time setting up your repositories."
            },
            {
              icon: <Sparkles className="w-5 h-5" />,
              title: "AI Powered",
              desc: "Leverages the server-side Google Gemini models to construct highly expressive, clear, and structured copy."
            },
            {
              icon: <Download className="w-5 h-5" />,
              title: "Export Markdown",
              desc: "Download README.md files directly to your hard drive to version control them alongside your application source code."
            }
          ].map((item, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-4 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 text-left transition-all duration-205"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-gray-950 dark:text-white">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            Get your generated file in four simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative max-w-6xl mx-auto">
          {/* Connector line for large screens */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[1px] bg-gray-200 dark:bg-gray-850 z-0" />
          
          {[
            { step: "01", title: "Choose Builder", desc: "Select between the step-by-step Profile wizard or Project repo scanner." },
            { step: "02", title: "Provide Info", desc: "Input your developer details or provide the link to a public GitHub repository." },
            { step: "03", title: "AI Generation", desc: "The Express API gateway optimizes inputs and calls the Gemini API model chain." },
            { step: "04", title: "Download README", desc: "Preview, format, copy, or download your optimized README.md documentation." }
          ].map((item, idx) => (
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

      {/* Screenshot / Browser Mockup Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">Modern Markdown Previewing</h2>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            Beautiful renders matching GitHub container styles.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-900/40 p-4 max-w-5xl mx-auto overflow-hidden shadow-xl transition-colors duration-300">
          {/* Simulated Browser window */}
          <div className="flex items-center gap-1.5 pb-3 border-b border-gray-200 dark:border-gray-800 px-2">
            <span className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/60" />
          </div>
          
          <div className="grid md:grid-cols-12 min-h-[380px] bg-white dark:bg-gray-950 transition-colors duration-300">
            {/* Sidebar info */}
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
                  <div className="font-semibold text-gray-950 dark:text-white">Trophies & Streaks</div>
                  <div className="text-gray-600 dark:text-gray-400">Live GitHub trophies and streak tracking widgets.</div>
                </div>
              </div>
            </div>
            
            {/* Interactive display area */}
            <div className="md:col-span-8 p-6 flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
              {/* Fake preview items */}
              <div className="w-full max-w-md p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl space-y-4 font-sans text-left transition-colors duration-300">
                <div className="flex items-center justify-between border-b border-gray-250 dark:border-gray-800 pb-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">Profile stats card</span>
                  <span className="text-[10px] text-green-600 dark:text-green-450 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping" /> Live</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Total Stars:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">412</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Total Commits:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">1,824</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>PRs Merged:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">153</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Everything you need to know about using README Forge.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden text-left shadow-sm"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-sm sm:text-base text-gray-950 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-450 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-xs sm:text-sm text-gray-650 dark:text-gray-400 leading-relaxed border-t border-gray-150 dark:border-gray-850 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
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
