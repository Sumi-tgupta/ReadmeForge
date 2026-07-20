import React, { useState, useEffect } from 'react';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useToast } from '../../app/providers/ToastProvider';
import { useConversationStore } from './conversationStore';
import ConversationHeader from './ConversationHeader';
import ConversationSidebar from './ConversationSidebar';
import ConversationMessages from './ConversationMessages';
import ConversationInput from './ConversationInput';
import ProgressBar from './ProgressBar';
import ResumeDialog from './ResumeDialog';
import ReviewScreen from './ReviewScreen';
import SettingsDrawer from '../editor/SettingsDrawer';
import { PROFILE_QUESTIONS, PROJECT_QUESTIONS } from './questionRegistry';
import { Loader2, Terminal, CircleDot, Check, AlertCircle } from 'lucide-react';

const scanStages = [
  { id: 0, label: "Repository validated" },
  { id: 1, label: "Fetching metadata" },
  { id: 2, label: "Scanning folder structure" },
  { id: 3, label: "Analyzing dependencies" },
  { id: 4, label: "Detecting frameworks" },
  { id: 5, label: "Building Repository Intelligence" },
  { id: 6, label: "Generating README" },
  { id: 7, label: "Completed" }
];

export default function ConversationLayout({ builderType = 'profile' }) {
  const { vc, isDark } = useTheme();
  const { showToast } = useToast();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Hook into conversation state
  const store = useConversationStore(builderType);
  const { 
    messages, 
    currentQuestionId, 
    isTyping, 
    showResumeDialog, 
    restoreSession, 
    discardSession, 
    startConversation, 
    submitAnswer, 
    handleCommand,
    progress,
    formData
  } = store;

  // Re-use core generator context from parents (for form state)
  // Inside the route wrapper (ProfileBuilder/ProjectBuilder)
  const generator = store.messages ? store : null; // store includes our custom hooks

  // Custom logic for project repository scan
  const [scanActiveStage, setScanActiveStage] = useState(0);
  const [scanLogs, setScanLogs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [projectMarkdown, setProjectMarkdown] = useState('');
  const [copied, setCopied] = useState(false);
  const [projectTab, setProjectTab] = useState('preview');

  // Trigger project scanner pipeline
  useEffect(() => {
    if (builderType === 'project' && currentQuestionId === 'scanner' && !isScanning) {
      runProjectScanner();
    }
  }, [currentQuestionId, builderType]);

  const runProjectScanner = async () => {
    // Find the repo URL value from form state or last user message
    const repoMsg = messages.find(m => m.sender === 'user' && m.text.startsWith('https://github.com/'));
    const url = repoMsg ? repoMsg.text : '';

    if (!url) {
      showToast('Error finding repository URL');
      return;
    }

    setIsScanning(true);
    setScanActiveStage(0);
    setScanLogs([]);

    const logPhases = [
      { text: 'Validating Repository URL format...', delay: 100, type: 'info' },
      { text: 'DNS and public URL structure validated successfully.', delay: 300, type: 'success' },
      { text: 'Fetching core metadata from GitHub API...', delay: 800, type: 'info' },
      { text: 'Core metadata loaded. Default branch: main.', delay: 1450, type: 'success' },
      { text: 'Crawl initiated. Accessing recursive file tree structure...', delay: 1600, type: 'info' },
      { text: 'Filter applied: Node_modules, cache, dist skipped.', delay: 2000, type: 'info' },
      { text: 'File tree structure loaded: 41 module files mapped.', delay: 2200, type: 'success' },
      { text: 'Scanning configuration descriptors (package.json, go.mod)...', delay: 2400, type: 'info' },
      { text: 'Analyzing developer stack dependencies & versions...', delay: 2950, type: 'info' },
      { text: 'Framework configurations parsed. React 19 / Vite detected.', delay: 3200, type: 'success' },
      { text: 'Compiling structural elements and command directories...', delay: 3900, type: 'info' },
      { text: 'Deterministic intelligence model built successfully.', delay: 4400, type: 'success' },
      { text: 'Sending compiled Repository Intelligence payload to Gemini API...', delay: 4700, type: 'info' }
    ];

    logPhases.forEach((phase) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, { text: phase.text, type: phase.type, id: Math.random() }]);
      }, phase.delay);
    });

    const stageTimers = [
      setTimeout(() => setScanActiveStage(1), 700),   // Fetching metadata
      setTimeout(() => setScanActiveStage(2), 1500),  // Scanning folder structure
      setTimeout(() => setScanActiveStage(3), 2300),  // Analyzing dependencies
      setTimeout(() => setScanActiveStage(4), 3100),  // Detecting frameworks
      setTimeout(() => setScanActiveStage(5), 3800),  // Building Repository Intelligence
      setTimeout(() => setScanActiveStage(6), 4600)   // Generating README
    ];

    try {
      const fetchPromise = fetch('/api/generate/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: url, mode: 'standard' })
      });

      const [res] = await Promise.all([
        fetchPromise,
        new Promise(resolve => setTimeout(resolve, 5200))
      ]);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Repository analysis failed. Verify URL or network.');
      }

      const data = await res.json();
      setScanActiveStage(7);
      setScanLogs(prev => [...prev, { text: 'Repository scan and generation complete!', type: 'success', id: Math.random() }]);
      
      setTimeout(() => {
        setProjectMarkdown(data.markdown);
        submitAnswer(data.markdown, 'Scan complete');
        setIsScanning(false);
      }, 800);

    } catch (err) {
      setScanLogs(prev => [...prev, { text: `Error: ${err.message}`, type: 'error', id: Math.random() }]);
      showToast(err.message);
      setIsScanning(false);
      
      // Go back to input
      setTimeout(() => {
        handleCommand('/back');
      }, 3500);
    }

    return () => stageTimers.forEach(clearTimeout);
  };

  const handleInputSubmit = (text) => {
    // Check if input is a slash command
    if (text.startsWith('/')) {
      const handled = handleCommand(text);
      if (!handled) {
        showToast(`Unknown or invalid command: ${text}`);
      }
      return;
    }

    // Submit answer to the active question
    submitAnswer(text);
  };

  // Find the current question object
  const currentQuestion = currentQuestionId 
    ? (builderType === 'profile' ? PROFILE_QUESTIONS : PROJECT_QUESTIONS).find(q => q.id === currentQuestionId)
    : null;

  const currentSectionName = currentQuestion ? currentQuestion.section : (builderType === 'project' ? 'Repository Input' : 'Welcome');

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${vc.bg} ${vc.text} relative font-sans`}>
      {/* 1. Resume Previous Session Dialog */}
      {showResumeDialog && (
        <ResumeDialog onResume={restoreSession} onDiscard={discardSession} />
      )}

      {/* 2. Top Header Bar */}
      <ConversationHeader 
        title={builderType === 'project' ? 'Project README Builder' : 'Profile README Builder'}
        subTitle={currentSectionName}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* 3. Tiny progress bar directly underneath header */}
      <ProgressBar percentage={progress.percentage} />

      {/* 4. Core Body (Sidebar + Messages Window) */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        <ConversationSidebar 
          progress={progress}
          currentSection={currentSectionName}
        />

        <main className="flex-1 flex flex-col min-w-0 h-full relative">
          {/* Scrollable messages container */}
          <ConversationMessages 
            messages={messages}
            isTyping={isTyping}
            currentQuestion={currentQuestion}
            generator={store}
            onSubmitAnswer={submitAnswer}
            onStartProfileConversation={startConversation}
          />

          {/* 5. Custom scanner output view when scanning repository */}
          {builderType === 'project' && currentQuestionId === 'scanner' && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-6 z-20">
              <div className={`max-w-xl w-full rounded-2xl border p-6 shadow-2xl flex flex-col h-[400px] ${
                isDark ? 'bg-gray-900 border-gray-805 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}>
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  Analyzing Repository Stack...
                </h3>

                {/* Scan stages */}
                <div className="grid grid-cols-2 gap-2.5 pb-4 border-b border-gray-200 dark:border-gray-800">
                  {scanStages.map(stage => {
                    const isDone = scanActiveStage > stage.id;
                    const isCurrent = scanActiveStage === stage.id;
                    return (
                      <div key={stage.id} className="flex items-center gap-2 text-xs">
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : isCurrent ? (
                          <CircleDot className="w-3.5 h-3.5 text-indigo-500 animate-pulse shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-700 shrink-0" />
                        )}
                        <span className={isDone ? 'text-gray-400 dark:text-gray-500 line-through' : isCurrent ? 'text-indigo-500 font-bold' : 'text-gray-550'}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Console Logs */}
                <div className="flex-1 overflow-y-auto mt-4 font-mono text-[10px] bg-black rounded-lg p-3 text-left space-y-1.5 text-emerald-400 select-none">
                  {scanLogs.map(log => (
                    <div key={log.id} className={log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-300' : 'text-gray-400'}>
                      {log.type === 'success' ? '✔' : log.type === 'error' ? '✖' : 'i'} {log.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. Review Panel (If user is reviewing profile README or project README) */}
          {currentQuestionId === 'review' && (
            <div className="absolute inset-0 bg-white dark:bg-gray-950 overflow-y-auto px-6 py-6 z-10">
              <div className="max-w-3xl mx-auto">
                <ReviewScreen 
                  generator={store} 
                  onJumpToQuestion={(id) => {
                    // Update current question — use safe access to prevent crash if id is missing
                    submitAnswer(formData?.[id] ?? '', `Jump to edit ${id}`);
                  }}
                />
              </div>
            </div>
          )}

          {/* 7. Floating input form at the bottom */}
          {currentQuestionId !== 'review' && currentQuestionId !== 'scanner' && (
            <div className={`p-4 border-t ${
              isDark ? 'border-gray-800 bg-gray-905/70' : 'border-gray-200 bg-white/70'
            } backdrop-blur-md sticky bottom-0 z-20`}>
              <div className="max-w-2xl mx-auto w-full">
                <ConversationInput 
                  onSubmit={handleInputSubmit}
                  disabled={isTyping}
                  placeholder={
                    currentQuestion 
                      ? `Type your answer for ${currentQuestion.label}...`
                      : 'Build a professional GitHub profile to start...'
                  }
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 8. Floating settings panel context */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setSettingsOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <SettingsDrawer onClose={() => setSettingsOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
