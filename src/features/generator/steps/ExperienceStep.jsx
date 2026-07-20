import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import InputField from '../../../components/common/InputField';

export default function ExperienceStep() {
  const { vc } = useTheme();
  const { formData, updateForm } = useGenerator();

  const addExp = () => updateForm('experiences', [...formData.experiences, { company: '', role: '', duration: '', description: '' }]);
  const updateExp = (i, key, val) => {
    const updated = [...formData.experiences];
    updated[i] = { ...updated[i], [key]: val };
    updateForm('experiences', updated);
  };
  const removeExp = (i) => updateForm('experiences', formData.experiences.filter((_, idx) => idx !== i));

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Work Experience</h2>
      <p className={`mb-6 ${vc.textSec}`}>Share your professional journey</p>
      <div className="space-y-4">
        {formData.experiences.map((ex, i) => (
          <div key={i} className={`p-4 rounded-xl ${vc.card}`}>
            <div className="flex justify-between items-start mb-3">
              <span className={`text-sm font-medium ${vc.textSec}`}>Experience {i + 1}</span>
              <button onClick={() => removeExp(i)} className="p-1 hover:text-red-500 transition-colors" aria-label="Remove experience entry"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <InputField label="Company" value={ex.company} onChange={v => updateExp(i, 'company', v)} placeholder="Acme Corp" />
              <InputField label="Role / Title" value={ex.role} onChange={v => updateExp(i, 'role', v)} placeholder="Senior Developer" />
            </div>
            <InputField label="Duration" value={ex.duration} onChange={v => updateExp(i, 'duration', v)} placeholder="Jan 2022 – Present" />
            <InputField label="One-liner" value={ex.description} onChange={v => updateExp(i, 'description', v)} placeholder="Led the frontend team to deliver..." />
          </div>
        ))}
      </div>
      <button onClick={addExp} className={`mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${vc.btnSec}`}>
        <Plus className="w-4 h-4" /> Add Experience
      </button>
    </div>
  );
}
