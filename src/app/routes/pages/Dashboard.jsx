import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { authApi } from '../../../services/authApi';
import { 
  BarChart3, Activity, Clock, CreditCard, ChevronRight, 
  Sparkles, Plus, Star, Copy, ExternalLink, Settings, 
  User, LayoutDashboard, Database, RefreshCw, FolderGit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { vc, isDark } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [credits, setCredits] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load usages, credits and recent projects in parallel
        const [usageData, creditsData, projectsData] = await Promise.all([
          fetch('/api/user/usage').then(r => r.json()).catch(() => ({})),
          fetch('/api/user/credits').then(r => r.json()).catch(() => ({})),
          authApi.getProjects().catch(() => [])
        ]);

        setStats(usageData);
        setCredits(creditsData);
        setRecentProjects(projectsData.slice(0, 3)); // show top 3 edited

      } catch (err) {
        showToast('Error loading dashboard analytics');
      } finally {
        setLoading(false);
      }
    };

    if (user) loadDashboardData();
  }, [user, showToast]);

  const handleDuplicate = async (projectId) => {
    try {
      await authApi.duplicateProject(projectId);
      showToast('Project duplicated successfully');
      // Refresh list
      const projectsData = await authApi.getProjects();
      setRecentProjects(projectsData.slice(0, 3));
    } catch (err) {
      showToast('Failed to duplicate project');
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await authApi.deleteProject(projectId);
      showToast('Project deleted');
      // Refresh list
      const projectsData = await authApi.getProjects();
      setRecentProjects(projectsData.slice(0, 3));
    } catch (err) {
      showToast('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col justify-center items-center gap-4 font-sans select-none">
        <RefreshCw className="w-8 h-8 text-[#5B8CFF] animate-spin" />
        <span className="text-xs text-[#9CA3AF]">Loading dashboard analytics...</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${vc.bg} ${vc.text} transition-colors duration-300 font-sans text-left`}>
      
      {/* SIDEBAR */}
      <aside className={`w-64 border-r shrink-0 hidden md:flex flex-col h-screen ${
        isDark ? 'border-gray-800 bg-gray-905' : 'border-gray-200 bg-gray-50/50'
      }`}>
        <div className="p-6 flex items-center gap-2.5 border-b border-gray-250 dark:border-gray-800">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold select-none">
            R
          </div>
          <span className="font-bold text-sm">README Forge</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-indigo-500/10 border border-indigo-500/10 text-indigo-500"
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </button>
          <button
            onClick={() => navigate('/my-projects')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FolderGit2 className="w-4 h-4" /> My Projects
          </button>
          <button
            onClick={() => navigate('/settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" /> System Settings
          </button>
        </nav>

        <div className="p-4 border-t border-gray-250 dark:border-gray-800 space-y-3">
          <div className="flex items-center gap-3">
            <img src={user.avatarUrl} alt={user.username} className="w-9 h-9 rounded-xl shadow-sm" />
            <div className="truncate">
              <div className="text-xs font-bold truncate">{user.displayName || user.username}</div>
              <div className="text-[10px] text-gray-500 truncate">@{user.username}</div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full text-center py-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-xs font-semibold rounded-xl transition-all"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className={`border-b shrink-0 px-6 py-4 flex items-center justify-between sticky top-0 z-35 ${
          isDark ? 'border-gray-800 bg-gray-950/80' : 'border-gray-200 bg-white/80'
        } backdrop-blur-md`}>
          <div className="text-left">
            <h1 className="text-base font-bold">User Dashboard</h1>
            <p className="text-[10px] text-gray-500">Monitor usage statistics and manage saved projects</p>
          </div>

          <button
            onClick={() => navigate('/')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isDark 
                ? 'border-gray-800 bg-gray-900 hover:text-white text-gray-400' 
                : 'border-gray-200 bg-white hover:text-gray-950 text-gray-500 shadow-sm'
            }`}
          >
            Back to Hub
          </button>
        </header>

        <div className="max-w-5xl w-full mx-auto px-6 py-8 space-y-6">
          {/* Welcome Banner */}
          <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center gap-5 justify-between ${
            isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-150 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img src={user.avatarUrl} alt={user.username} className="w-14 h-14 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm" />
              <div>
                <h2 className="text-lg font-extrabold text-white">Welcome back, {user.displayName || user.username}!</h2>
                <p className={`text-xs ${vc.textSec}`}>Manage your profiles, crawl project repositories, and synchronize setups.</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/profile-builder')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition-colors active:scale-95"
              >
                <Plus className="w-4 h-4" /> Profile README
              </button>
              <button 
                onClick={() => navigate('/project-builder')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  isDark ? 'border-gray-800 bg-gray-850 hover:bg-gray-800 text-gray-300' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <FolderGit2 className="w-4 h-4" /> Scan Project
              </button>
            </div>
          </div>

          {/* Cards metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-white border-gray-150'}`}>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Plan Tier</div>
              <div className="text-2xl font-black capitalize text-indigo-500">{credits?.plan || 'free'}</div>
              <div className="text-[9px] text-gray-550">Connected to GitHub Account</div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-white border-gray-150'}`}>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Quota Credits</div>
              <div className="text-2xl font-black">{credits?.credits !== undefined ? (credits.credits === -1 ? 'Unlimited' : `${credits.credits} / 20`) : '0'}</div>
              <div className="text-[9px] text-gray-550">Resets monthly</div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-white border-gray-150'}`}>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> Total Generations</div>
              <div className="text-2xl font-black font-mono">{stats?.totalGenerations || 0}</div>
              <div className="text-[9px] text-gray-550">AI gate cache hits included</div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-white border-gray-150'}`}>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Today's Requests</div>
              <div className="text-2xl font-black font-mono">{stats?.todayGenerations || 0}</div>
              <div className="text-[9px] text-gray-550">Request queue rate-limits safe</div>
            </div>
          </div>

          {/* Recent projects grid */}
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500">Recent Projects</h3>
              <button 
                onClick={() => navigate('/my-projects')}
                className="text-xs font-semibold text-indigo-500 flex items-center gap-0.5 hover:opacity-80 transition-opacity"
              >
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentProjects.map(proj => (
                <div 
                  key={proj.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between h-[180px] hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-200 ${
                    isDark ? 'bg-gray-900/40 border-gray-800 hover:bg-gray-900 hover:border-gray-700' : 'bg-white border-gray-150 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-3 mb-2.5">
                      <h4 className="font-bold text-sm truncate pr-4 text-white/95">{proj.title}</h4>
                      {proj.is_favorite === 1 && <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400 shrink-0" />}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold tracking-wide uppercase ${
                        proj.builder_type === 'project' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {proj.builder_type}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold tracking-wide uppercase ${
                        isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {proj.builder_style}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-3">
                    <button
                      onClick={() => {
                        // Open project by restoring data
                        // Set active generator configurations and redirect
                        window.sessionStorage.setItem('readme_forge_chat_profile', JSON.stringify({
                          formData: JSON.parse(proj.input_data || '{}'),
                          currentQuestionId: 'review'
                        }));
                        navigate(proj.builder_type === 'project' ? '/project-builder' : '/profile-builder');
                      }}
                      className="text-xs font-semibold text-indigo-500 hover:opacity-80 transition-opacity flex items-center gap-1"
                    >
                      Open <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDuplicate(proj.id)} 
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-white"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(proj.id)} 
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-500"
                        title="Delete"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {recentProjects.length === 0 && (
                <div className={`col-span-full py-12 rounded-2xl border border-dashed border-gray-250 dark:border-gray-800 text-center text-xs ${vc.textSec}`}>
                  No saved README projects yet. Start building to save progress!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
