import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { authApi } from '../../../services/authApi';
import { 
  FolderGit2, Search, ArrowLeft, Star, Grid, List, 
  Trash2, Copy, Edit2, Play, Plus, Clock, RefreshCw, LayoutDashboard
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useSEO from '../../../hooks/useSEO';

export default function Projects() {
  const { user } = useAuth();
  const { vc, isDark } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useSEO({
    title: 'My Saved Projects',
    description: 'View, search, edit, and duplicate your saved GitHub profile and project README templates.'
  });

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
    if (proj.builder_type === 'project') {
      window.sessionStorage.setItem('readme_forge_project_restore', JSON.stringify({
        repoUrl: JSON.parse(proj.input_data || '{}').repoUrl || proj.title || '',
        generatedMarkdown: proj.output_data || ''
      }));
      navigate('/project-builder');
    } else {
      window.sessionStorage.setItem('readme_forge_chat_profile', JSON.stringify({
        formData: JSON.parse(proj.input_data || '{}'),
        currentQuestionId: 'review'
      }));
      navigate('/profile-builder');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-955' : 'bg-[#E2DFD2]'} flex flex-col justify-center items-center gap-4 font-sans select-none`}>
        <RefreshCw className="w-8 h-8 text-[#5B8CFF] animate-spin" />
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading saved configurations...</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-955' : 'bg-[#E2DFD2]'} ${vc.text} transition-colors duration-300 font-sans text-left`}>
      
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
          
          {/* Clickable Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-650 flex items-center justify-center shadow-lg shadow-indigo-500/15 group-hover:scale-105 transition-all duration-300">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-gray-950 dark:from-white to-gray-500 dark:to-gray-400 bg-clip-text text-transparent hidden sm:block">
              README<span className="text-indigo-600 dark:text-indigo-400 ml-0.5">Forge</span>
            </span>
          </Link>
          
          <div className={`h-5 w-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'} hidden sm:block`} />

          <div className="text-left hidden sm:block">
            <h1 className="text-xs font-bold flex items-center gap-1.5 text-gray-500">
              <FolderGit2 className="w-4.5 h-4.5 text-indigo-500" />
              My Saved READMEs
            </h1>
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
                      aria-label="Toggle favorite"
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
                      aria-label="Duplicate project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(proj.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-500"
                      title="Delete"
                      aria-label="Delete project"
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
                  <button onClick={() => handleFavorite(proj.id)} aria-label="Toggle favorite">
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
                    aria-label="Duplicate project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(proj.id)}
                    className="p-1 text-gray-550 hover:text-red-500"
                    aria-label="Delete project"
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
