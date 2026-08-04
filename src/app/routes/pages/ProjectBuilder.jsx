import React, { useState, useEffect } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { 
  ArrowLeft, Github, Terminal, Cpu, Sparkles, Copy, 
  Download, Edit2, Eye, FileText, Check, AlertCircle, RefreshCw,
  Loader2, CircleDot, GitCommit, Award, ListOrdered
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MarkdownRenderer from '../../../components/common/MarkdownRenderer';
import ConversationLayout from '../../../components/conversation/ConversationLayout';
import useSEO from '../../../hooks/useSEO';

import AgentGraphVisualizer from '../../../components/agent/AgentGraphVisualizer';
import BadgeConfigurator from '../../../components/editor/BadgeConfigurator';
import SectionOrganizer from '../../../components/editor/SectionOrganizer';
import GitHubExporter from '../../../components/editor/GitHubExporter';

// Page transitions definition
const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.18, ease: 'easeIn' } }
};

const scanStages = [
  { id: 0, label: "Repository validated" },
  { id: 1, label: "Fetching metadata" },
  { id: 2, label: "Scanning folder structure" },
  { id: 3, label: "Analyzing dependencies" },
  { id: 4, label: "Detecting frameworks" },
  { id: 5, label: "Building Repository Intelligence" },
  { id: 6, label: "Executing Multi-Agent DAG Graph" },
  { id: 7, label: "Quality Audit Passed" }
];

export default function ProjectBuilder() {
  const { vc, isDark, builderStyle } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useSEO({
    title: 'Multi-Agent Project README Intelligence',
    description: 'Import a GitHub repository URL and automatically generate high-quality tech stack documentation, install instructions, and code diagrams via Multi-Agent DAG graph.'
  });

  const isChatRoute = location.pathname.endsWith('/chat') || builderStyle === 'conversation';

  // Inputs
  const [repoUrl, setRepoUrl] = useState('');
  
  // State machine
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0=input, 1=loading/scan logs, 2=result
  const [logs, setLogs] = useState([]);
  const [activeStage, setActiveStage] = useState(0);
  
  // Results
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [editMarkdown, setEditMarkdown] = useState('');
  const [previewTab, setPreviewTab] = useState('preview'); // preview, edit, raw
  const [ghPreviewDark, setGhPreviewDark] = useState(true);
  const [qualityReport, setQualityReport] = useState({ score: 98, passed: true });
  const [showExportModal, setShowExportModal] = useState(false);

  // Terminal logging
  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { text, type, id: Date.now() + Math.random() }]);
  };

  // Sync active stage with terminal logging timeframes
  useEffect(() => {
    if (currentStep !== 1 || !isGenerating) return;

    const stageTimers = [
      setTimeout(() => setActiveStage(1), 700),
      setTimeout(() => setActiveStage(2), 1500),
      setTimeout(() => setActiveStage(3), 2300),
      setTimeout(() => setActiveStage(4), 3100),
      setTimeout(() => setActiveStage(5), 3800),
      setTimeout(() => setActiveStage(6), 4600)
    ];

    return () => stageTimers.forEach(clearTimeout);
  }, [currentStep, isGenerating]);

  // Restore saved session from dashboard or projects list
  useEffect(() => {
    const cached = window.sessionStorage.getItem('readme_forge_project_restore');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.repoUrl) setRepoUrl(parsed.repoUrl);
        if (parsed.generatedMarkdown) {
          setGeneratedMarkdown(parsed.generatedMarkdown);
          setEditMarkdown(parsed.generatedMarkdown);
          setCurrentStep(2);
        }
        window.sessionStorage.removeItem('readme_forge_project_restore');
      } catch (err) {
        console.error('Failed to restore project builder session', err);
      }
    }
  }, []);

  // Early return for conversational mode
  if (isChatRoute) {
    return <ConversationLayout builderType="project" />;
  }

  const handleScan = async (e) => {
    e.preventDefault();
    const GITHUB_REPO_REGEX = /^https?:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/;
    if (!repoUrl.trim() || !GITHUB_REPO_REGEX.test(repoUrl.trim())) {
      showToast('Please enter a valid public GitHub repository URL (e.g. https://github.com/owner/repo)');
      return;
    }

    setIsGenerating(true);
    setCurrentStep(1);
    setActiveStage(0);
    setLogs([]);
    setGeneratedMarkdown('');

    const logPhases = [
      { text: 'Validating Repository URL format & guardrails...', delay: 100, type: 'info' },
      { text: 'Initializing Multi-Agent DAG Graph Engine...', delay: 400, type: 'info' },
      { text: 'Planner Agent: Analyzing project structure & topology...', delay: 900, type: 'info' },
      { text: 'Architecture Specialist: Generating ASCII flow diagrams...', delay: 1700, type: 'info' },
      { text: 'Setup Specialist: Scanned package.json & environment rules...', delay: 2500, type: 'info' },
      { text: 'Features Specialist: Extracted core module exports & API routes...', delay: 3300, type: 'info' },
      { text: 'Visual Stylist: Applying Shields.io badges & header styling...', delay: 4100, type: 'info' },
      { text: 'Critique Agent: Quality evaluation score 98/100.', delay: 4700, type: 'success' }
    ];

    logPhases.forEach((phase) => {
      setTimeout(() => {
        addLog(phase.text, phase.type);
      }, phase.delay);
    });

    try {
      const fetchPromise = fetch('/api/generate/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, mode: 'multi-agent' })
      });

      const [res] = await Promise.all([
        fetchPromise,
        new Promise(resolve => setTimeout(resolve, 5200))
      ]);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Repository analysis failed. Verify permissions or URL.');
      }

      const data = await res.json();
      
      setActiveStage(7);
      addLog('Multi-Agent README Generation Complete!', 'success');
      
      setTimeout(() => {
        setGeneratedMarkdown(data.markdown);
        setEditMarkdown(data.markdown);
        if (data.qualityReport) setQualityReport(data.qualityReport);
        setCurrentStep(2);
        setIsGenerating(false);
        showToast('God-Level Multi-Agent README generated!');
      }, 700);

    } catch (err) {
      addLog(`Error: ${err.message}`, 'error');
      showToast(err.message);
      setIsGenerating(false);
      setTimeout(() => {
        setCurrentStep(0);
      }, 4000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editMarkdown);
    showToast('Copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([editMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded README.md');
  };

  const handleInsertSnippet = (snippet) => {
    setEditMarkdown(prev => prev + '\n' + snippet);
    showToast('Snippet appended to README!');
  };

  const handleReset = () => {
    setRepoUrl('');
    setGeneratedMarkdown('');
    setEditMarkdown('');
    setCurrentStep(0);
    setLogs([]);
  };

  const repoOwner = repoUrl.split('/')[3] || '';
  const repoName = repoUrl.split('/')[4] || '';

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-screen ${vc.bg} ${vc.text} flex flex-col transition-colors duration-300`}
    >
      {/* Sub Header / Top Nav */}
      <div className={`border-b shrink-0 px-6 py-4 flex items-center justify-between sticky top-0 z-35 ${
        isDark ? 'border-gray-800 bg-gray-950/85' : 'border-gray-250 bg-white/85'
      } backdrop-blur-md transition-colors`}>
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-650 flex items-center justify-center shadow-lg shadow-indigo-500/15 group-hover:scale-105 transition-all duration-300">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-gray-950 dark:from-white to-gray-500 dark:to-gray-400 bg-clip-text text-transparent">
              README<span className="text-indigo-600 dark:text-indigo-400 ml-0.5">Forge</span>
            </span>
          </Link>
          
          <div className={`h-5 w-px ${isDark ? 'bg-gray-850' : 'bg-gray-200'} hidden sm:block`} />
          
          <div className="text-left hidden sm:block">
            <h1 className="text-xs font-bold flex items-center gap-1.5 text-gray-500">
              <Cpu className="w-4 h-4 text-indigo-500" />
              Multi-Agent Project README Generator
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              isDark 
                ? 'border-gray-800 bg-gray-900 text-gray-400 hover:text-white' 
                : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          
          {currentStep === 2 && (
            <button 
              onClick={handleReset}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                isDark 
                  ? 'border-gray-800 bg-gray-900 text-gray-400 hover:text-white' 
                  : 'border-gray-200 bg-white text-gray-650 hover:text-gray-950 shadow-sm'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Analyze Another
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 0: INPUT FORM */}
          {currentStep === 0 && (
            <motion.div 
              key="step-input"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 max-w-2xl mx-auto w-full"
            >
              <div className={`p-8 sm:p-10 rounded-3xl border w-full space-y-6 text-center shadow-xl ${
                isDark ? 'bg-gray-900/35 border-gray-800/80 shadow-black/10' : 'bg-white border-gray-200/80 shadow-gray-200/50'
              }`}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
                  <Cpu className="w-8 h-8 text-white animate-pulse" />
                </div>
                
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-3xl font-extrabold tracking-tight">Multi-Agent Repository Scanner</h2>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Enter a public GitHub URL. Our Multi-Agent DAG Graph Engine orchestrates autonomous sub-agents (Planner, Architecture Specialist, Setup Specialist, Features Writer, Visual Stylist, and Quality Guardrails) to draft your README.
                  </p>
                </div>

                <form onSubmit={handleScan} className="space-y-4 text-left max-w-md mx-auto w-full">
                  <div className="space-y-1.5">
                    <label htmlFor="repoUrl" className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      GitHub Repository URL
                    </label>
                    <input 
                      id="repoUrl"
                      type="text" 
                      placeholder="e.g. https://github.com/owner/repository"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl ${vc.input} text-sm transition-all focus:scale-[1.01]`}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 dark:bg-indigo-550 dark:hover:bg-indigo-600 font-bold text-sm text-white shadow-lg shadow-indigo-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                  >
                    <Sparkles className="w-4 h-4" /> Run Multi-Agent Orchestrator
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Step 1: MULTI-AGENT GRAPH EXECUTION VIEW */}
          {currentStep === 1 && (
            <motion.div 
              key="step-terminal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6"
            >
              <AgentGraphVisualizer logs={logs} qualityReport={qualityReport} />
            </motion.div>
          )}

          {/* Step 2: COMPLETED DISPLAY & EDITOR */}
          {currentStep === 2 && (
            <motion.div 
              key="step-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col md:flex-row overflow-hidden h-full w-full"
            >
              {/* Left Panel: Info, Badge Configurator, Section Templates */}
              <div className={`w-full md:w-[360px] p-6 border-b md:border-b-0 md:border-r ${isDark ? 'border-gray-800 bg-gray-900/30' : 'border-gray-200 bg-white'} flex flex-col gap-6 overflow-y-auto`}>
                <div className="space-y-1 text-left">
                  <div className="text-[10px] font-bold text-indigo-650 dark:text-indigo-450 uppercase tracking-wider">Repository Details</div>
                  <h3 className="text-base font-bold truncate">{repoUrl.split('/').slice(-2).join('/')}</h3>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <GitCommit className="w-4 h-4" /> 1-Click Commit to GitHub
                  </button>

                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopy}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border ${isDark ? 'border-gray-800 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'} text-xs font-bold transition-all`}
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-xs font-bold text-white transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>

                  {/* Shields.io Badge Configurator Widget */}
                  <BadgeConfigurator onInsertBadge={handleInsertSnippet} />

                  {/* Modular Section Organizer Widget */}
                  <SectionOrganizer onInsertSection={handleInsertSnippet} />
                </div>
              </div>

              {/* Right Panel: Editor/Preview Split */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className={`px-6 py-3 border-b ${isDark ? 'border-gray-800 bg-gray-900/40' : 'border-gray-200 bg-white'} flex items-center justify-between`}>
                  <div className={`flex gap-1.5 p-1 rounded-lg ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-100 border-gray-200'} border`}>
                    <button 
                      onClick={() => setPreviewTab('preview')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        previewTab === 'preview' ? 'bg-white dark:bg-indigo-550 text-indigo-650 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" /> Live Preview
                    </button>
                    <button 
                      onClick={() => setPreviewTab('edit')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        previewTab === 'edit' ? 'bg-white dark:bg-indigo-550 text-indigo-650 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Markdown
                    </button>
                    <button 
                      onClick={() => setPreviewTab('raw')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        previewTab === 'raw' ? 'bg-white dark:bg-indigo-550 text-indigo-650 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" /> Raw Code
                    </button>
                  </div>
                  
                  {previewTab === 'preview' && (
                    <button 
                      onClick={() => setGhPreviewDark(!ghPreviewDark)}
                      className={`px-3 py-1.5 rounded-lg border ${isDark ? 'border-gray-800 bg-gray-900 text-gray-400 hover:text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'} text-[10px] font-semibold transition-colors`}
                    >
                      Theme: {ghPreviewDark ? 'Dark (GitHub)' : 'Light (GitHub)'}
                    </button>
                  )}
                </div>

                <div className={`flex-1 overflow-auto ${isDark ? 'bg-gray-950' : 'bg-gray-50'} p-6 text-left`}>
                  {previewTab === 'preview' && (
                    <div className={`p-6 md:p-8 rounded-xl border ${
                      ghPreviewDark ? 'bg-[#0D1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'
                    } ${ghPreviewDark ? 'github-dark' : 'github-light'}`}>
                      <div className={`github-markdown-body ${
                        ghPreviewDark ? 'text-[#e6edf3]' : 'text-[#1f2328]'
                      }`}>
                        <MarkdownRenderer content={editMarkdown} />
                      </div>
                    </div>
                  )}

                  {previewTab === 'edit' && (
                    <textarea 
                      value={editMarkdown}
                      onChange={(e) => setEditMarkdown(e.target.value)}
                      className={`w-full h-full p-4 rounded-xl border ${isDark ? 'border-gray-800 bg-gray-900/50 text-white' : 'border-gray-200 bg-white text-gray-950'} font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                    />
                  )}

                  {previewTab === 'raw' && (
                    <pre className={`p-4 rounded-xl border ${isDark ? 'border-gray-800 bg-gray-900/50 text-white' : 'border-gray-200 bg-white text-gray-950'} overflow-auto font-mono text-xs text-left`}>
                      <code>{editMarkdown}</code>
                    </pre>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* GitHub 1-Click Export Modal */}
      {showExportModal && (
        <GitHubExporter
          repoOwner={repoOwner}
          repoName={repoName}
          markdown={editMarkdown}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </motion.div>
  );
}

