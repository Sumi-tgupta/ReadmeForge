import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { authApi } from '../../../services/authApi';
import { 
  FolderGit2, Search, ArrowLeft, Star, Grid, List, 
  Trash2, Copy, Edit2, Play, Plus, Clock, RefreshCw, LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Projects() {
  const { user } = useAuth();
  const { vc, isDark } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, profile, project
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await authApi.getProjects();
      setProjects(data);
    } catch (err) {
      showToast('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadProjects();
  }, [user]);

  // Filter & Sort projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || p.builder_type === filterType;
      const matchFav = !onlyFavorites || p.is_favorite === 1;
      return matchSearch && matchType && matchFav;
    });
  }, [projects, search, filterType, onlyFavorites]);

  const handleFavorite = async (id) => {
    try {
      await authApi.toggleFavorite(id);
      loadProjects();
      showToast('Project updated');
    } catch (err) {
      showToast('Failed to update favorite status');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await authApi.duplicateProject(id);
      loadProjects();
      showToast('Project duplicated');
    } catch (err) {
      showToast('Failed to duplicate project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This action is permanent.')) return;
    try {
      await authApi.deleteProject(id);
      loadProjects();
      showToast('Project deleted');
    } catch (err) {
      showToast('Failed to delete project');
    }
  };

  const handleOpen = (proj) => {
    // Save state back to sessionStorage to let builder pick it up
    window.sessionStorage.setItem('readme_forge_chat_profile', JSON.stringify({
      formData: JSON.parse(proj.input_data || '{}'),
      currentQuestionId: 'review'
    }));
    navigate(proj.builder_type === 'project' ? '/project-builder' : '/profile-builder');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col justify-center items-center gap-4 font-sans select-none">
        <RefreshCw className="w-8 h-8 text-[#5B8CFF] animate-spin" />
        <span className="text-xs text-[#9CA3AF]">Loading saved configurations...</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${vc.bg} ${vc.text} transition-colors duration-300 font-sans text-left`}>
      
      {/* Header bar */}
      <header className={`border-b shrink-0 px-6 py-4 flex items-center justify-between sticky top-0 z-35 ${
        isDark ? 'border-gray-800 bg-gray-950/85' : 'border-gray-200 bg-white/85'
      } backdrop-blur-md`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className={`p-2 rounded-lg border transition-colors ${
              isDark 
                ? 'border-gray-800 bg-gray-900 hover:text-white text-gray-400' 
                : 'border-gray-200 bg-white hover:text-gray-950 text-gray-500 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold flex items-center gap-2">
              <FolderGit2 className="w-4.5 h-4.5 text-indigo-500" />
              My Saved READMEs
            </h1>
            <p className="text-[10px] text-gray-500">Manage and edit your saved configurations</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/profile-builder')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> New README
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 space-y-6">
        
        {/* Filters Panel */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row gap-4 items-center justify-between ${
          isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-150 shadow-sm'
        }`}>
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className={`w-full pl-9 pr-4 py-2 rounded-lg text-xs transition-all outline-none ${vc.input}`}
            />
          </div>

          {/* Filtering options */}
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto justify-end">
            <div className="flex rounded-lg border border-gray-250 dark:border-gray-800 p-0.5 bg-gray-50 dark:bg-gray-950">
              {['all', 'profile', 'project'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-wide transition-all ${
                    filterType === t
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => setOnlyFavorites(p => !p)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                onlyFavorites
                  ? 'bg-amber-500/15 border-amber-500/35 text-amber-500'
                  : isDark ? 'border-gray-800 bg-gray-900 text-gray-400' : 'border-gray-200 bg-white text-gray-600'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-500' : ''}`} /> Favorites Only
            </button>

            <div className="flex rounded-lg border border-gray-250 dark:border-gray-800 p-0.5 bg-gray-50 dark:bg-gray-950">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-gray-500'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-gray-500'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid/List View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {filteredProjects.map(proj => (
              <div
                key={proj.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between h-[180px] hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-200 ${
                  isDark ? 'bg-gray-900/40 border-gray-800 hover:bg-gray-900 hover:border-gray-700' : 'bg-white border-gray-150 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2.5 mb-2.5">
                    <h4 className="font-bold text-sm truncate pr-4 text-white/95">{proj.title}</h4>
                    <button 
                      onClick={() => handleFavorite(proj.id)}
                      className="p-0.5 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-4 h-4 ${proj.is_favorite === 1 ? 'text-amber-400 fill-amber-400' : 'text-gray-500'}`} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      proj.builder_type === 'project' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {proj.builder_type}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-650'
                    }`}>
                      {proj.builder_style}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-3.5">
                  <button
                    onClick={() => handleOpen(proj)}
                    className="text-xs font-semibold text-indigo-500 flex items-center gap-1 hover:opacity-85"
                  >
                    Open Editor <Play className="w-3 h-3 fill-indigo-500" />
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
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <div className={`col-span-full py-16 rounded-2xl border border-dashed border-gray-250 dark:border-gray-800 text-center text-xs ${vc.textSec}`}>
                No matching saved projects found.
              </div>
            )}
          </div>
        ) : (
          /* List View */
          <div className={`border rounded-2xl divide-y overflow-hidden ${
            isDark ? 'bg-gray-900/40 border-gray-800 divide-gray-800' : 'bg-white border-gray-150 divide-gray-200'
          }`}>
            {filteredProjects.map(proj => (
              <div key={proj.id} className="p-4 flex items-center justify-between hover:bg-gray-150/10 transition-colors">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <button onClick={() => handleFavorite(proj.id)}>
                    <Star className={`w-4 h-4 ${proj.is_favorite === 1 ? 'text-amber-400 fill-amber-400' : 'text-gray-500'}`} />
                  </button>
                  <div className="truncate text-left">
                    <h4 className="font-bold text-xs text-white/95 truncate">{proj.title}</h4>
                    <span className="text-[9px] text-gray-500">Last edited: {new Date(proj.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      proj.builder_type === 'project' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {proj.builder_type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpen(proj)}
                    className="text-xs font-semibold text-indigo-500 hover:opacity-85 flex items-center gap-1"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDuplicate(proj.id)}
                    className="p-1 text-gray-550 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(proj.id)}
                    className="p-1 text-gray-550 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <div className={`p-8 text-center text-xs ${vc.textSec}`}>
                No matching projects found.
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
