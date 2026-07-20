import React from 'react';
import { Star, ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import InputField from '../../../components/common/InputField';
import TextareaField from '../../../components/common/TextareaField';
import ToggleSwitch from '../../../components/common/ToggleSwitch';

export default function ProjectsStep() {
  const { vc } = useTheme();
  const { formData, updateForm, expandedProject, setExpandedProject } = useGenerator();

  const addProject = () => {
    if (formData.projects.length < 6) {
      updateForm('projects', [...formData.projects, { name: '', description: '', repoUrl: '', demoUrl: '', tags: '', starred: false }]);
      setExpandedProject(formData.projects.length);
    }
  };

  const updateProject = (i, key, val) => {
    const updated = [...formData.projects];
    updated[i] = { ...updated[i], [key]: val };
    updateForm('projects', updated);
  };

  const removeProject = (i) => {
    updateForm('projects', formData.projects.filter((_, idx) => idx !== i));
    setExpandedProject(-1);
  };

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Projects Showcase</h2>
      <p className={`mb-6 ${vc.textSec}`}>Highlight your best projects (up to 6)</p>

      <div className="space-y-3">
        {formData.projects.map((pr, i) => (
          <div key={i} className={`rounded-xl border overflow-hidden transition-all ${vc.card}`}>
            <div
              onClick={() => setExpandedProject(expandedProject === i ? -1 : i)}
              className={`w-full flex items-center justify-between p-4 text-left cursor-pointer ${vc.text}`}
            >
              <div className="flex items-center gap-2">
                {pr.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                <span className="font-medium text-sm">{pr.name || `Project ${i + 1}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); removeProject(i); }} className="p-1 hover:text-red-500 transition-colors" aria-label="Remove project">
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedProject === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
            {expandedProject === i && (
              <div className="px-4 pb-4 border-t border-gray-200 pt-4 animate-fade-in">
                <InputField label="Project Name" value={pr.name} onChange={v => updateProject(i, 'name', v)} placeholder="My Awesome Project" />
                <TextareaField label="Description" value={pr.description} onChange={v => updateProject(i, 'description', v)} placeholder="A brief description..." maxLen={200} rows={2} />
                <InputField label="GitHub Repo URL" value={pr.repoUrl} onChange={v => updateProject(i, 'repoUrl', v)} placeholder="https://github.com/user/repo" />
                <InputField label="Live Demo URL" value={pr.demoUrl} onChange={v => updateProject(i, 'demoUrl', v)} placeholder="https://myproject.com" />
                <InputField label="Tech Tags" value={pr.tags} onChange={v => updateProject(i, 'tags', v)} placeholder="React, Node.js, PostgreSQL" />
                <ToggleSwitch label="⭐ Highlight this project" value={pr.starred} onChange={v => updateProject(i, 'starred', v)} />
              </div>
            )}
          </div>
        ))}
      </div>

      {formData.projects.length < 6 && (
        <button onClick={addProject} className={`mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${vc.btnSec}`}>
          <Plus className="w-4 h-4" /> Add Project
        </button>
      )}
    </div>
  );
}
