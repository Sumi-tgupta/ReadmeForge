import React, { useState } from 'react';
import { Plus, Trash, Check, ArrowRight, Share2, Award, Briefcase, Rocket } from 'lucide-react';
import { useTheme } from '../../app/providers/ThemeProvider';
import TechPicker from '../../features/generator/TechPicker';
import { UNIQUE_TECHS } from '../../constants/techs';

export default React.memo(function QuestionRenderer({ question, generator, onSubmit }) {
  const { vc, isDark } = useTheme();
  const { formData, updateForm, updateSocial, toggleTech, toggleLearningTech } = generator;

  // Local state for dynamic lists
  const [localText, setLocalText] = useState('');

  if (!question) return null;

  // 1. DROPDOWN RENDERER
  if (question.component === 'Dropdown') {
    const options = question.options || [];
    return (
      <div className="flex flex-wrap gap-2.5 mt-2 animate-fade-in">
        {options.map(opt => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return (
            <button
              key={value}
              onClick={() => onSubmit(value, label)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 hover:scale-102 active:scale-95 ${
                isDark
                  ? 'bg-gray-900 border-gray-800 text-gray-300 hover:text-white hover:border-gray-700'
                  : 'bg-white border-gray-200 text-gray-750 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  // 2. TOGGLE RENDERER
  if (question.component === 'Toggle') {
    return (
      <div className="flex gap-3 mt-2 animate-fade-in">
        <button
          onClick={() => onSubmit(true, 'Yes')}
          className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-650 text-white transition-colors"
        >
          Yes
        </button>
        <button
          onClick={() => onSubmit(false, 'No')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
            isDark 
              ? 'border-gray-800 bg-gray-900 hover:bg-gray-850 text-gray-300' 
              : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
          }`}
        >
          No
        </button>
      </div>
    );
  }

  // 3. TECH PICKER RENDERER
  if (question.component === 'Tech Picker') {
    const isLearning = question.id === 'learningTechs';
    const selectedList = isLearning ? formData.learningTechs : formData.selectedTechs;
    const toggleFn = isLearning ? toggleLearningTech : toggleTech;

    const handleConfirm = () => {
      const names = selectedList
        .map(id => UNIQUE_TECHS.find(t => t.uniqueKey === id)?.name)
        .filter(Boolean)
        .join(', ');
      
      onSubmit(selectedList, names || 'None selected');
    };

    return (
      <div className={`mt-3 p-5 rounded-2xl border ${
        isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50/50 border-gray-150'
      } animate-fade-in`}>
        <TechPicker
          selected={selectedList}
          onToggle={toggleFn}
          title={question.label}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-all active:scale-95 shadow-sm"
          >
            Confirm Skills <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 4. SOCIAL LINKS RENDERER
  if (question.component === 'Social Links') {
    const socialsList = [
      { id: 'linkedin', label: 'LinkedIn Username' },
      { id: 'twitter', label: 'Twitter / X Username' },
      { id: 'portfolio', label: 'Portfolio URL' },
      { id: 'medium', label: 'Medium Username' },
      { id: 'leetcode', label: 'LeetCode Username' },
      { id: 'buymeacoffee', label: 'Buy Me A Coffee Username' },
    ];

    return (
      <div className={`mt-3 p-5 rounded-2xl border space-y-4 ${
        isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50/50 border-gray-150'
      } animate-fade-in`}>
        <h3 className="text-xs font-bold text-gray-550 flex items-center gap-1.5"><Share2 className="w-4 h-4 text-indigo-400" /> Enter Social Profiles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialsList.map(s => (
            <div key={s.id} className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{s.label}</label>
              <input
                type="text"
                value={formData.social[s.id] || ''}
                onChange={e => updateSocial(s.id, e.target.value)}
                placeholder={`Username or URL...`}
                className={`w-full px-3 py-2 rounded-lg text-xs transition-all outline-none ${vc.input}`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-2">
          <button
            onClick={() => onSubmit(formData.social, 'Social links updated')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-all active:scale-95 shadow-sm"
          >
            Confirm Social Links <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 5. PROJECT LIST RENDERER
  if (question.component === 'Project List') {
    const handleAddProject = () => {
      const newProj = { title: 'My Awesome Project', desc: 'A short description of this project.', url: '', tags: 'react, tailwind' };
      updateForm('projects', [...formData.projects, newProj]);
    };

    const handleUpdateProject = (index, key, val) => {
      const list = [...formData.projects];
      list[index][key] = val;
      updateForm('projects', list);
    };

    const handleRemoveProject = (index) => {
      const list = formData.projects.filter((_, idx) => idx !== index);
      updateForm('projects', list);
    };

    const handleConfirm = () => {
      const count = formData.projects.length;
      onSubmit(formData.projects, `${count} project${count !== 1 ? 's' : ''} added`);
    };

    return (
      <div className={`mt-3 p-5 rounded-2xl border space-y-4 ${
        isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50/50 border-gray-150'
      } animate-fade-in`}>
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-gray-550 flex items-center gap-1.5"><Rocket className="w-4 h-4 text-indigo-400" /> Projects Showcase</h3>
          <button
            onClick={handleAddProject}
            className="flex items-center gap-1 px-3 py-1 rounded-lg border border-dashed border-indigo-500/30 text-indigo-500 text-xs font-semibold hover:bg-indigo-500/5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Project
          </button>
        </div>

        <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
          {formData.projects.map((proj, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/35 relative space-y-2.5">
              <button
                onClick={() => handleRemoveProject(idx)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-550">Project Title</span>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={e => handleUpdateProject(idx, 'title', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs transition-all outline-none ${vc.input}`}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-550">Project Link</span>
                  <input
                    type="text"
                    value={proj.url}
                    placeholder="https://github.com/..."
                    onChange={e => handleUpdateProject(idx, 'url', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs transition-all outline-none ${vc.input}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-550">Description</span>
                <textarea
                  rows={2}
                  value={proj.desc}
                  onChange={e => handleUpdateProject(idx, 'desc', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-xs transition-all outline-none resize-none ${vc.input}`}
                />
              </div>
            </div>
          ))}
          {formData.projects.length === 0 && (
            <p className={`text-center py-6 text-xs ${vc.textSec}`}>No projects added yet.</p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-all active:scale-95 shadow-sm"
          >
            Confirm Projects <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 6. EXPERIENCE LIST RENDERER
  if (question.component === 'Experience List') {
    const handleAddExp = () => {
      const newExp = { role: 'Software Engineer', company: 'Tech Inc', duration: '2023 - Present', description: 'Developed React web applications.' };
      updateForm('experiences', [...formData.experiences, newExp]);
    };

    const handleUpdateExp = (index, key, val) => {
      const list = [...formData.experiences];
      list[index][key] = val;
      updateForm('experiences', list);
    };

    const handleRemoveExp = (index) => {
      const list = formData.experiences.filter((_, idx) => idx !== index);
      updateForm('experiences', list);
    };

    const handleConfirm = () => {
      const count = formData.experiences.length;
      onSubmit(formData.experiences, `${count} experience${count !== 1 ? 's' : ''} added`);
    };

    return (
      <div className={`mt-3 p-5 rounded-2xl border space-y-4 ${
        isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50/50 border-gray-150'
      } animate-fade-in`}>
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-gray-550 flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-indigo-400" /> Work Experience</h3>
          <button
            onClick={handleAddExp}
            className="flex items-center gap-1 px-3 py-1 rounded-lg border border-dashed border-indigo-500/30 text-indigo-500 text-xs font-semibold hover:bg-indigo-500/5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Role
          </button>
        </div>

        <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
          {formData.experiences.map((exp, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/35 relative space-y-2.5">
              <button
                onClick={() => handleRemoveExp(idx)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-550">Role / Title</span>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={e => handleUpdateExp(idx, 'role', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs transition-all outline-none ${vc.input}`}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-550">Company</span>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={e => handleUpdateExp(idx, 'company', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs transition-all outline-none ${vc.input}`}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-550">Duration</span>
                  <input
                    type="text"
                    value={exp.duration}
                    placeholder="e.g. 2022 - 2024"
                    onChange={e => handleUpdateExp(idx, 'duration', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs transition-all outline-none ${vc.input}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-550">Key Responsibilities</span>
                <textarea
                  rows={2}
                  value={exp.description}
                  onChange={e => handleUpdateExp(idx, 'description', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-xs transition-all outline-none resize-none ${vc.input}`}
                />
              </div>
            </div>
          ))}
          {formData.experiences.length === 0 && (
            <p className={`text-center py-6 text-xs ${vc.textSec}`}>No experience added yet.</p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-all active:scale-95 shadow-sm"
          >
            Confirm Experience <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 7. EDUCATION LIST RENDERER
  if (question.component === 'Education List') {
    const handleAddEd = () => {
      const newEd = { school: 'University of Technology', degree: 'B.S. in Computer Science', year: '2024' };
      updateForm('educationEntries', [...formData.educationEntries, newEd]);
    };

    const handleUpdateEd = (index, key, val) => {
      const list = [...formData.educationEntries];
      list[index][key] = val;
      updateForm('educationEntries', list);
    };

    const handleRemoveEd = (index) => {
      const list = formData.educationEntries.filter((_, idx) => idx !== index);
      updateForm('educationEntries', list);
    };

    const handleConfirm = () => {
      const count = formData.educationEntries.length;
      onSubmit(formData.educationEntries, `${count} education entry added`);
    };

    return (
      <div className={`mt-3 p-5 rounded-2xl border space-y-4 ${
        isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50/50 border-gray-150'
      } animate-fade-in`}>
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-gray-550 flex items-center gap-1.5"><Award className="w-4 h-4 text-indigo-400" /> Education & Certifications</h3>
          <button
            onClick={handleAddEd}
            className="flex items-center gap-1 px-3 py-1 rounded-lg border border-dashed border-indigo-500/30 text-indigo-500 text-xs font-semibold hover:bg-indigo-500/5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Degree
          </button>
        </div>

        <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
          {formData.educationEntries.map((ed, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/35 relative space-y-2.5">
              <button
                onClick={() => handleRemoveEd(idx)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-550">School / Academy</span>
                  <input
                    type="text"
                    value={ed.school}
                    onChange={e => handleUpdateEd(idx, 'school', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs transition-all outline-none ${vc.input}`}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-550">Degree / Certification</span>
                  <input
                    type="text"
                    value={ed.degree}
                    onChange={e => handleUpdateEd(idx, 'degree', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs transition-all outline-none ${vc.input}`}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-550">Graduation Year</span>
                  <input
                    type="text"
                    value={ed.year}
                    placeholder="e.g. 2024"
                    onChange={e => handleUpdateEd(idx, 'year', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs transition-all outline-none ${vc.input}`}
                  />
                </div>
              </div>
            </div>
          ))}
          {formData.educationEntries.length === 0 && (
            <p className={`text-center py-6 text-xs ${vc.textSec}`}>No education items added yet.</p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-all active:scale-95 shadow-sm"
          >
            Confirm Education <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // DEFAULT FALLBACK (simple field inputs can be typed or clicked)
  return null;
});

