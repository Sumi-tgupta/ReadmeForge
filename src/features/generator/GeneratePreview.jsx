import React, { useEffect, useState } from 'react';
import {
  Sparkles, Loader2, RefreshCw, Copy, ArrowLeft,
  Sun, Moon, FileText, Save
} from 'lucide-react';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useGenerator } from '../../hooks/useGenerator';
import { useToast } from '../../app/providers/ToastProvider';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../services/authApi';
import { parseMarkdownToHtml } from '../../utils/markdown';
import { copyToClipboard, downloadFile } from '../../utils/clipboard';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';


/**
 * Final step: Generate & Preview — split-screen layout.
 * Left panel: generate button, raw editor.
 * Right panel: tabbed preview (raw markdown, clean render, GitHub UI).
 */
export default function GeneratePreview() {
  const { vc, isDark } = useTheme();
  const { showToast } = useToast();
  const { executeWithAuth, user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [projectId, setProjectId] = useState(null);

  const skeletonWidths = React.useMemo(() => ({
    top: [...Array(8)].map(() => `${60 + Math.random() * 40}%`),
    bottom: [...Array(4)].map(() => `${40 + Math.random() * 50}%`)
  }), []);

  const {
    formData,
    generatedMarkdown,
    editMarkdown,
    setEditMarkdown,
    isGenerating,
    generateReadme,
    previewTab,
    setPreviewTab,
    previewSubTab,
    setPreviewSubTab,
    ghPreviewDark,
    setGhPreviewDark,
    goBack,
  } = useGenerator();

  // Listen to resume generation event on successful login redirect
  useEffect(() => {
    const handleResume = () => {
      generateReadme();
    };
    window.addEventListener('readme_forge_resume_generation', handleResume);
    return () => window.removeEventListener('readme_forge_resume_generation', handleResume);
  }, [generateReadme]);

  const handleSave = () => {
    executeWithAuth(async () => {
      setIsSaving(true);
      try {
        let title = 'My README';
        if (!projectId) {
          const userTitle = prompt('Enter a project title:', formData.name ? `${formData.name} Profile` : 'My GitHub Profile');
          if (userTitle === null) {
            setIsSaving(false);
            return; // Cancelled
          }
          title = userTitle || 'My GitHub Profile';
        }

        const projectData = {
          title,
          builderType: 'profile',
          builderStyle: 'wizard',
          inputData: formData,
          generatedMarkdown: editMarkdown || generatedMarkdown
        };

        if (projectId) {
          await authApi.updateProject(projectId, projectData);
          showToast('Project updated successfully!');
        } else {
          const saved = await authApi.createProject(projectData);
          setProjectId(saved.id);
          showToast('Project saved successfully!');
        }
      } catch (err) {
        showToast('Failed to save project');
      } finally {
        setIsSaving(false);
      }
    }, 'project save');
  };

  const mdToRender = editMarkdown || generatedMarkdown;
  const renderedHtml = parseMarkdownToHtml(mdToRender);

  const copyMarkdown = async () => {
    const success = await copyToClipboard(editMarkdown || generatedMarkdown);
    showToast(success ? 'Copied to clipboard!' : 'Failed to copy.');
  };

  const handleDownload = () => {
    downloadFile(editMarkdown || generatedMarkdown, 'README.md');
    showToast('README.md downloaded!');
  };

  // --- Raw markdown view ---
  const renderRawMarkdown = () => {
    const lines = mdToRender ? mdToRender.split('\n') : [];
    return (
      <div className="relative rounded-xl overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-xs text-gray-400">markdown</span>
          <button onClick={copyMarkdown} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
            <Copy className="w-3 h-3" /> Copy
          </button>
        </div>
        <div className="overflow-auto max-h-[70vh] bg-[#1e1e2e] p-0">
          <table className="w-full text-sm font-mono">
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} className="hover:bg-white/5">
                  <td className="text-right pr-4 pl-4 py-0.5 text-gray-500 select-none w-12 border-r border-gray-700/50">{i + 1}</td>
                  <td className="pl-4 pr-4 py-0.5 text-gray-200 whitespace-pre-wrap break-all">{line || ' '}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // --- Clean preview ---
  const renderCleanPreview = () => (
    <div className={`p-8 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-auto max-h-[70vh]`}>
      <div className="github-markdown-body">
        <MarkdownRenderer content={mdToRender} />
      </div>
    </div>
  );

  // --- GitHub UI preview ---
  const renderGithubPreview = () => (
    <div className={`rounded-xl overflow-hidden border ${ghPreviewDark ? 'border-[#30363d]' : 'border-[#d0d7de]'}`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b ${ghPreviewDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'}`}>
        <div className="flex items-center gap-2">
          <FileText className={`w-4 h-4 ${ghPreviewDark ? 'text-[#8b949e]' : 'text-gray-500'}`} />
          <span className={`text-sm ${ghPreviewDark ? 'text-[#e6edf3]' : 'text-[#1f2328]'}`}>
            <span className="font-semibold">{formData.username || 'username'}</span>
            <span className={ghPreviewDark ? 'text-[#8b949e]' : 'text-gray-500'}> / </span>
            <span className="font-semibold">{formData.username || 'username'}</span>
          </span>
        </div>
        <button
          onClick={() => setGhPreviewDark(d => !d)}
          className={`p-1 rounded transition-colors ${ghPreviewDark ? 'text-[#8b949e] hover:text-[#e6edf3]' : 'text-gray-500 hover:text-gray-800'}`}
          aria-label="Toggle GitHub Preview Theme"
        >
          {ghPreviewDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
      <div className={`px-4 py-2 border-b text-xs ${ghPreviewDark ? 'bg-[#0d1117] border-[#30363d] text-[#8b949e]' : 'bg-white border-[#d0d7de] text-gray-500'}`}>
        README.md
      </div>
      <div className={`p-6 overflow-auto max-h-[65vh] shadow-inner ${ghPreviewDark ? 'bg-[#0d1117]' : 'bg-white'} ${ghPreviewDark ? 'github-dark' : ''}`}>
        <div className={`github-markdown-body ${ghPreviewDark ? 'text-[#e6edf3]' : 'text-[#1f2328]'}`}>
          <MarkdownRenderer content={mdToRender} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row lg:h-[calc(100vh-60px)] lg:overflow-hidden">
      {/* LEFT PANEL — Generate controls + editor */}
      <div className={`w-full lg:w-[40%] p-6 lg:overflow-y-auto border-b lg:border-b-0 lg:border-r ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Generate & Preview</h2>
        <p className={`mb-6 ${vc.textSec}`}>Generate your README with AI</p>

        <div className="space-y-3 mb-6">
          {!generatedMarkdown ? (
            <button
              onClick={() => executeWithAuth(generateReadme, 'README generation')}
              disabled={isGenerating}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-base font-semibold transition-all active:scale-95 ${vc.btn} ${isGenerating ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isGenerating ? 'Crafting your README...' : 'Generate README'}
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={() => executeWithAuth(generateReadme, 'README generation')}
                  disabled={isGenerating}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${vc.btnSec} ${isGenerating ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Regenerate
                </button>
                <button
                  onClick={copyMarkdown}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${vc.btn}`}
                >
                  <Copy className="w-4 h-4" /> Copy Markdown
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 border ${
                    isDark ? 'border-gray-800 bg-gray-900 text-gray-300' : 'border-gray-250 bg-white text-gray-700'
                  }`}
                >
                  <Save className="w-4 h-4 text-indigo-500" />
                  {isSaving ? 'Saving...' : projectId ? 'Update Saved Project' : 'Save Project'}
                </button>
                <button
                  onClick={handleDownload}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${vc.btnSec}`}
                >
                  Download README.md
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Inline editor */}
        {generatedMarkdown && (
          <div>
            <label className={`block text-sm font-medium mb-2 ${vc.text}`}>Quick Edit</label>
            <textarea
              value={editMarkdown}
              onChange={e => setEditMarkdown(e.target.value)}
              rows={20}
              className={`w-full px-4 py-3 rounded-xl font-mono text-xs transition-all outline-none resize-none ${vc.input}`}
            />
          </div>
        )}

        <button
          onClick={goBack}
          className={`mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${vc.btnSec}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Editing
        </button>
      </div>

      {/* RIGHT PANEL — Preview */}
      <div className={`w-full lg:w-[60%] flex flex-col lg:overflow-hidden ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'} min-h-[450px] lg:min-h-0`}>
        {/* Tab bar */}
        <div className={`flex items-center gap-1 p-2 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className={`flex gap-1 p-1 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <button
              onClick={() => setPreviewTab('raw')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${previewTab === 'raw' ? vc.tabActive : vc.tabInactive}`}
            >
              Raw Markdown
            </button>
            <button
              onClick={() => setPreviewTab('preview')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${previewTab === 'preview' ? vc.tabActive : vc.tabInactive}`}
            >
              Preview
            </button>
          </div>
          {previewTab === 'preview' && (
            <div className={`flex gap-1 p-1 rounded-lg ml-2 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <button
                onClick={() => setPreviewSubTab('clean')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${previewSubTab === 'clean' ? vc.tabActive : vc.tabInactive}`}
              >
                Clean Render
              </button>
              <button
                onClick={() => setPreviewSubTab('github')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${previewSubTab === 'github' ? vc.tabActive : vc.tabInactive}`}
              >
                GitHub UI
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {!mdToRender ? (
            isGenerating ? (
              <div className="space-y-4 p-6">
                {skeletonWidths.top.map((width, i) => (
                  <div key={i} className="h-4 rounded-full shimmer-bg" style={{ width }} />
                ))}
                <div className="h-8 my-4" />
                {skeletonWidths.bottom.map((width, i) => (
                  <div key={`b-${i}`} className="h-3 rounded-full shimmer-bg" style={{ width }} />
                ))}
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center h-full border-2 border-dashed rounded-2xl p-12 ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                <Sparkles className={`w-12 h-12 mb-4 ${vc.textSec}`} />
                <p className={`text-lg font-medium ${vc.textSec}`}>Your README preview will appear here</p>
                <p className={`text-sm mt-1 ${vc.textSec}`}>Click "Generate README" to get started</p>
              </div>
            )
          ) : (
            previewTab === 'raw'
              ? renderRawMarkdown()
              : previewSubTab === 'clean'
                ? renderCleanPreview()
                : renderGithubPreview()
          )}
        </div>
      </div>
    </div>
  );
}
