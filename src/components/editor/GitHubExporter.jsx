import React, { useState } from 'react';
import { GitCommit, Github, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function GitHubExporter({ repoOwner: defaultOwner = '', repoName: defaultRepo = '', markdown = '', onClose }) {
  const [owner, setOwner] = useState(defaultOwner);
  const [repo, setRepo] = useState(defaultRepo);
  const [branch, setBranch] = useState('main');
  const [commitMsg, setCommitMsg] = useState('docs: update README via README Forge');
  const [status, setStatus] = useState('idle'); // idle | exporting | success | error
  const [resultMsg, setResultMsg] = useState('');
  const [commitUrl, setCommitUrl] = useState('');

  const handleExport = async () => {
    if (!owner || !repo || !markdown) {
      setStatus('error');
      setResultMsg('Please specify repository owner, name, and markdown content.');
      return;
    }

    setStatus('exporting');
    setResultMsg('');

    try {
      const res = await fetch('/api/projects/export-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoOwner: owner,
          repoName: repo,
          branch,
          commitMessage: commitMsg,
          markdown
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setResultMsg(data.message || 'README successfully committed to GitHub repository!');
        setCommitUrl(data.commitUrl);
      } else {
        setStatus('error');
        setResultMsg(data.error || 'Failed to export to GitHub.');
      }
    } catch (err) {
      setStatus('error');
      setResultMsg(err.message || 'Network error while contacting export server.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white space-y-5 shadow-2xl relative">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Github className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">One-Click GitHub Export</h3>
            <p className="text-xs text-slate-400">Commit README directly to target repository</p>
          </div>
        </div>

        {status === 'idle' || status === 'exporting' ? (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Repository Owner / Username</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="e.g. facebook"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Repository Name</label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="e.g. react"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Commit Message</label>
              <input
                type="text"
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        ) : null}

        {/* Status Messages */}
        {status === 'error' && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{resultMsg}</span>
          </div>
        )}

        {status === 'success' && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-semibold text-sm">{resultMsg}</div>
            {commitUrl && (
              <a
                href={commitUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-indigo-400 underline font-mono text-[11px] pt-1"
              >
                View Commit on GitHub &rarr;
              </a>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            {status === 'success' ? 'Close' : 'Cancel'}
          </button>
          {status !== 'success' && (
            <button
              onClick={handleExport}
              disabled={status === 'exporting'}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              {status === 'exporting' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Committing...</span>
                </>
              ) : (
                <>
                  <GitCommit className="w-3.5 h-3.5" />
                  <span>Commit to GitHub</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
