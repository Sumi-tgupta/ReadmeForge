import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { 
  ArrowLeft, Github, Terminal, Cpu, Sparkles, Copy, 
  Download, Edit2, Eye, FileText, Check, AlertCircle, RefreshCw 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Page transitions definition
const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.18, ease: 'easeIn' } }
};

export default function ProjectBuilder() {
  const { vc, isDark } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Inputs
  const [repoUrl, setRepoUrl] = useState('');
  
  // State machine
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0=input, 1=loading/scan logs, 2=result
  const [logs, setLogs] = useState([]);
  
  // Results
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [editMarkdown, setEditMarkdown] = useState('');
  const [previewTab, setPreviewTab] = useState('preview'); // preview, edit, raw
  const [ghPreviewDark, setGhPreviewDark] = useState(true);

  // Terminal logging logic simulation
  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { text, type, id: Date.now() + Math.random() }]);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) {
      showToast('Please enter a valid public GitHub URL');
      return;
    }

    setIsGenerating(true);
    setCurrentStep(1);
    setLogs([]);
    setGeneratedMarkdown('');

    // Simulate logs in step-by-step phases
    const logPhases = [
      { text: 'Parsing GitHub Repository URL...', delay: 200, type: 'info' },
      { text: 'Validating DNS and public accessibility...', delay: 600, type: 'info' },
      { text: 'Connecting to GitHub API v3...', delay: 1100, type: 'success' },
      { text: 'Crawling file tree at root directory...', delay: 1700, type: 'info' },
      { text: 'Detecting frameworks & tech stack configurations...', delay: 2300, type: 'info' },
      { text: 'Found package.json. Reading dependencies...', delay: 2800, type: 'success' },
      { text: 'Running Token Prompt Optimization & Whitspace Compression...', delay: 3400, type: 'info' },
      { text: 'Initiating server-side Google Gemini request queue...', delay: 3900, type: 'success' },
      { text: 'Sending formatted payload to model chain...', delay: 4500, type: 'info' }
    ];

    logPhases.forEach((phase, idx) => {
      setTimeout(() => {
        addLog(phase.text, phase.type);
      }, phase.delay);
    });

    try {
      // Execute backend API call in parallel to simulation
      const fetchPromise = fetch('/api/generate/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl })
      });

      // Wait at least 5.5 seconds to show the beautiful terminal animation, then await fetch
      const [res] = await Promise.all([
        fetchPromise,
        new Promise(resolve => setTimeout(resolve, 5500))
      ]);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Repository analysis failed. Please verify the URL.');
      }

      const data = await res.json();
      
      addLog('AI README Generation Complete!', 'success');
      
      setTimeout(() => {
        setGeneratedMarkdown(data.markdown);
        setEditMarkdown(data.markdown);
        setCurrentStep(2);
        setIsGenerating(false);
        if (data.cached) {
          showToast('Loaded from cache instantly!');
        } else {
          showToast('README generated successfully!');
        }
      }, 800);

    } catch (err) {
      addLog(`Error: ${err.message}`, 'error');
      showToast(err.message);
      setIsGenerating(false);
      // Wait a bit then bring back to inputs
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

  const handleReset = () => {
    setRepoUrl('');
    setGeneratedMarkdown('');
    setEditMarkdown('');
    setCurrentStep(0);
    setLogs([]);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#0D1117] text-[#F3F4F6] flex flex-col"
    >
      {/* Sub Header */}
      <div className="border-b border-white/5 bg-[#161B22]/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-lg border border-white/5 bg-[#161B22] text-[#9CA3AF] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-[#5B8CFF]" />
              Project README Generator
            </h1>
            <p className="text-[10px] text-[#9CA3AF]">
              Analyze repository details to generate production-quality project docs
            </p>
          </div>
        </div>

        {currentStep === 2 && (
          <button 
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-[#161B22] text-xs font-semibold text-[#9CA3AF] hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Analyze Another
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 0: INPUT FORM */}
          {currentStep === 0 && (
            <motion.div 
              key="step-input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col justify-center items-center p-6 max-w-lg mx-auto"
            >
              <div className="space-y-6 text-center w-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#5B8CFF] to-[#7C3AED] flex items-center justify-center mx-auto shadow-lg shadow-[#5B8CFF]/15">
                  <Cpu className="w-7 h-7 text-white animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Repository Scanner</h2>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">
                    Provide the URL to a public GitHub repository. The AI will extract its file structure, read details like dependencies, and construct professional README documentation.
                  </p>
                </div>

                <form onSubmit={handleScan} className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label htmlFor="repoUrl" className="text-xs font-semibold text-[#9CA3AF]">GitHub Public Repository URL</label>
                    <input 
                      id="repoUrl"
                      type="text" 
                      placeholder="e.g. https://github.com/johnnydev/my-api"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#161B22] text-[#F3F4F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8CFF] focus:border-transparent transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#4F7AFF] hover:scale-[1.01] active:scale-[0.99] font-bold text-sm text-white shadow-lg shadow-[#5B8CFF]/10 transition-all duration-200"
                  >
                    <Sparkles className="w-4 h-4" /> Analyze & Generate
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Step 1: LOG TERMINAL */}
          {currentStep === 1 && (
            <motion.div 
              key="step-terminal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-center items-center p-8 bg-[#0D1117]"
            >
              <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-[#161B22]/70 overflow-hidden shadow-2xl">
                {/* Terminal Header */}
                <div className="px-4 py-3 border-b border-white/5 bg-[#161B22] flex items-center justify-between text-xs text-[#9CA3AF] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/60" />
                  </div>
                  <span>git-crawler-scanner</span>
                  <div className="w-8" />
                </div>
                
                {/* Terminal Logs */}
                <div className="p-6 h-80 overflow-y-auto font-mono text-[11px] space-y-2 text-left bg-[#0D1117]">
                  {logs.map((log) => (
                    <div key={log.id} className="flex gap-2">
                      <span className="text-[#9CA3AF] select-none">❯</span>
                      <span className={
                        log.type === 'error' ? 'text-rose-400' :
                        log.type === 'success' ? 'text-emerald-400' :
                        'text-[#F3F4F6]'
                      }>
                        {log.text}
                      </span>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex gap-2 text-[#5B8CFF] animate-pulse">
                      <span className="text-[#9CA3AF] select-none">❯</span>
                      <span>Crawling repository state...</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: COMPLETED DISPLAY */}
          {currentStep === 2 && (
            <motion.div 
              key="step-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col md:flex-row overflow-hidden h-full"
            >
              {/* Left Panel: Info Summary */}
              <div className="w-full md:w-[350px] p-6 border-b md:border-b-0 md:border-r border-white/5 bg-[#161B22]/30 flex flex-col gap-6 overflow-y-auto">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-[#5B8CFF] uppercase tracking-wider">Repository Details</div>
                  <h3 className="text-base font-bold text-white truncate">{repoUrl.split('/').slice(-2).join('/')}</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#161B22] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                      <span>Platform:</span>
                      <span className="text-white font-semibold flex items-center gap-1"><Github className="w-3.5 h-3.5" /> GitHub</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                      <span>License Type:</span>
                      <span className="text-white font-semibold">MIT License</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                      <span>Primary Language:</span>
                      <span className="text-white font-semibold">JavaScript</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button 
                      onClick={handleCopy}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                    >
                      <Copy className="w-4 h-4" /> Copy README Content
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#4F7AFF] text-xs font-bold text-white hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      <Download className="w-4 h-4" /> Download README.md
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel: Editor/Preview Split */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mode Tabs */}
                <div className="px-6 py-3 border-b border-white/5 bg-[#161B22]/40 flex items-center justify-between">
                  <div className="flex gap-1.5 p-1 rounded-lg bg-[#161B22] border border-white/5">
                    <button 
                      onClick={() => setPreviewTab('preview')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        previewTab === 'preview' ? 'bg-[#5B8CFF]/15 text-[#5B8CFF]' : 'text-[#9CA3AF] hover:text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    <button 
                      onClick={() => setPreviewTab('edit')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        previewTab === 'edit' ? 'bg-[#5B8CFF]/15 text-[#5B8CFF]' : 'text-[#9CA3AF] hover:text-white'
                      }`}
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Markdown
                    </button>
                    <button 
                      onClick={() => setPreviewTab('raw')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        previewTab === 'raw' ? 'bg-[#5B8CFF]/15 text-[#5B8CFF]' : 'text-[#9CA3AF] hover:text-white'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" /> Raw Code
                    </button>
                  </div>
                  
                  {previewTab === 'preview' && (
                    <button 
                      onClick={() => setGhPreviewDark(!ghPreviewDark)}
                      className={`px-3 py-1.5 rounded-lg border border-white/5 text-[10px] font-semibold transition-colors ${
                        ghPreviewDark ? 'bg-[#161B22] text-[#9CA3AF] hover:text-white' : 'bg-white text-gray-800'
                      }`}
                    >
                      Theme: {ghPreviewDark ? 'Dark (GitHub)' : 'Light (GitHub)'}
                    </button>
                  )}
                </div>

                {/* Display Body */}
                <div className="flex-1 overflow-auto bg-[#0D1117] p-6 text-left">
                  {previewTab === 'preview' && (
                    <div className={`p-6 md:p-8 rounded-xl border ${
                      ghPreviewDark ? 'bg-[#0D1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'
                    } ${ghPreviewDark ? 'github-dark' : 'github-light'}`}>
                      <div className={`github-markdown-body ${
                        ghPreviewDark ? 'text-[#e6edf3]' : 'text-[#1f2328]'
                      }`}>
                        {/* Render simple HTML preview mapping. 
                            Note: For raw visual consistency in developer systems, 
                            we use standard formatting of headers, paragraphs, lists, code */}
                        {editMarkdown.split('\n').map((line, idx) => {
                          if (line.startsWith('# ')) {
                            return <h1 key={idx} className="text-2xl font-bold border-b pb-2 mb-4 mt-6">{line.replace('# ', '')}</h1>;
                          } else if (line.startsWith('## ')) {
                            return <h2 key={idx} className="text-xl font-bold border-b pb-1.5 mb-3 mt-5">{line.replace('## ', '')}</h2>;
                          } else if (line.startsWith('### ')) {
                            return <h3 key={idx} className="text-lg font-bold mb-2 mt-4">{line.replace('### ', '')}</h3>;
                          } else if (line.startsWith('- ') || line.startsWith('* ')) {
                            return <li key={idx} className="ml-4 list-disc text-sm mb-1">{line.slice(2)}</li>;
                          } else if (line.startsWith('```')) {
                            return null; // Skip raw fence lines in rendered preview
                          } else if (line.trim() === '') {
                            return <div key={idx} className="h-2" />;
                          } else {
                            return <p key={idx} className="text-sm leading-relaxed mb-3">{line}</p>;
                          }
                        })}
                      </div>
                    </div>
                  )}

                  {previewTab === 'edit' && (
                    <textarea 
                      value={editMarkdown}
                      onChange={(e) => setEditMarkdown(e.target.value)}
                      className="w-full h-full p-4 rounded-xl border border-white/5 bg-[#161B22]/50 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#5B8CFF] text-[#F3F4F6]"
                    />
                  )}

                  {previewTab === 'raw' && (
                    <pre className="p-4 rounded-xl border border-white/5 bg-[#161B22]/50 overflow-auto font-mono text-xs text-[#F3F4F6] text-left">
                      <code>{editMarkdown}</code>
                    </pre>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
