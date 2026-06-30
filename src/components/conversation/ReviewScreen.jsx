import React, { useState } from 'react';
import { useTheme } from '../../app/providers/ThemeProvider';
import { 
  User, Code2, Rocket, Share2, BarChart2, Edit2, 
  Check, FileText, Loader2, Copy, Download, Save 
} from 'lucide-react';
import MarkdownRenderer from '../common/MarkdownRenderer';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../services/authApi';

export default function ReviewScreen({ generator, onJumpToQuestion }) {
  const { vc, isDark } = useTheme();
  const { executeWithAuth } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [projectId, setProjectId] = useState(null);

  const { 
    formData, 
    updateForm, 
    updateSocial, 
    generateReadme, 
    isGenerating, 
    generatedMarkdown, 
    editMarkdown, 
    setEditMarkdown 
  } = generator;

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
          builderStyle: 'conversation',
          inputData: formData,
          generatedMarkdown: editMarkdown || generatedMarkdown
        };

        if (projectId) {
          await authApi.updateProject(projectId, projectData);
          alert('Project updated successfully!');
        } else {
          const saved = await authApi.createProject(projectData);
          setProjectId(saved.id);
          alert('Project saved successfully!');
        }
      } catch (err) {
        alert('Failed to save project');
      } finally {
        setIsSaving(false);
      }
    }, 'project save');
  };

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview', 'raw'

  const handleCopy = () => {
    navigator.clipboard.writeText(editMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
  };

  return (
    <div className="w-full space-y-6 mt-4 animate-fade-in text-left">
      {/* If already generated, show preview options */}
      {generatedMarkdown ? (
        <div className={`p-6 rounded-2xl border ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-150 shadow-md'
        } space-y-5`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                Your README is Ready!
              </h3>
              <p className={`text-xs ${vc.textSec}`}>Review, copy, or download your custom profile README.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 p-0.5 bg-gray-50 dark:bg-gray-950">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'preview'
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Live Preview
                </button>
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'raw'
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Raw Code
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 transition-colors border border-gray-200 dark:border-gray-800"
              >
                <Save className="w-3.5 h-3.5 text-indigo-500" />
                {isSaving ? 'Saving...' : projectId ? 'Updated' : 'Save'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-4 max-h-[500px] overflow-y-auto">
            {activeTab === 'preview' ? (
              <MarkdownRenderer content={editMarkdown} />
            ) : (
              <textarea
                value={editMarkdown}
                onChange={(e) => setEditMarkdown(e.target.value)}
                rows={16}
                className="w-full font-mono text-xs leading-relaxed bg-transparent border-0 outline-none resize-none text-gray-800 dark:text-gray-200 focus:ring-0"
              />
            )}
          </div>
        </div>
      ) : null}

      {/* Review summary list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info Card */}
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-150'} space-y-3 relative group`}>
          <button 
            onClick={() => onJumpToQuestion('name')}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <h4 className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
            <User className="w-4 h-4 text-blue-500" /> Basic Information
          </h4>
          <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
            <div><span className="text-gray-400">Name:</span> {formData.name || 'Not provided'}</div>
            <div><span className="text-gray-400">Username:</span> {formData.username || 'Not provided'}</div>
            <div><span className="text-gray-400">Tagline:</span> {formData.tagline || 'Not provided'}</div>
            <div><span className="text-gray-400">Location:</span> {formData.location || 'Not provided'}</div>
          </div>
        </div>

        {/* Skills Card */}
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-150'} space-y-3 relative group`}>
          <button 
            onClick={() => onJumpToQuestion('selectedTechs')}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <h4 className="text-xs font-bold text-gray-550 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-emerald-500" /> Technical Skills
          </h4>
          <div className="flex flex-wrap gap-1">
            {formData.selectedTechs.length > 0 ? (
              formData.selectedTechs.map(id => (
                <span key={id} className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                  isDark ? 'bg-gray-800 text-gray-350' : 'bg-gray-100 text-gray-650'
                }`}>
                  {id}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">No skills selected</span>
            )}
          </div>
        </div>

        {/* Projects Card */}
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-150'} space-y-3 relative group`}>
          <button 
            onClick={() => onJumpToQuestion('projects')}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <h4 className="text-xs font-bold text-gray-550 flex items-center gap-1.5">
            <Rocket className="w-4 h-4 text-purple-500" /> Projects Showcase
          </h4>
          <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
            {formData.projects.length > 0 ? (
              formData.projects.map((p, idx) => (
                <div key={idx} className="truncate">• <span className="font-semibold text-white/90">{p.title}</span> - {p.desc}</div>
              ))
            ) : (
              <span className="text-xs text-gray-400">No projects listed</span>
            )}
          </div>
        </div>

        {/* Social Links Card */}
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-150'} space-y-3 relative group`}>
          <button 
            onClick={() => onJumpToQuestion('social_links')}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <h4 className="text-xs font-bold text-gray-550 flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-amber-500" /> Social Networks
          </h4>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-700 dark:text-gray-300">
            {Object.entries(formData.social || {}).filter(([_, val]) => val).length > 0 ? (
              Object.entries(formData.social || {})
                .filter(([_, val]) => val)
                .slice(0, 4)
                .map(([key, val]) => (
                  <div key={key} className="truncate"><span className="text-gray-400 capitalize">{key}:</span> {val}</div>
                ))
            ) : (
              <span className="text-xs text-gray-400 col-span-2">No social networks added</span>
            )}
          </div>
        </div>
      </div>

      {/* Action panel at the bottom */}
      {!generatedMarkdown ? (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => executeWithAuth(generateReadme, 'README generation')}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition-all duration-150 active:scale-[0.98] shadow-lg shadow-indigo-500/15 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                Generating Profile README...
              </>
            ) : (
              <>
                <Check className="w-4.5 h-4.5" />
                Generate Profile README
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
