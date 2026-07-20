import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import TextareaField from '../../../components/common/TextareaField';

export default function OpenSourceStep() {
  const { vc } = useTheme();
  const { formData, updateForm } = useGenerator();

  const addLink = () => {
    if (formData.ossLinks.length < 5) updateForm('ossLinks', [...formData.ossLinks, { label: '', url: '' }]);
  };
  const updateLink = (i, key, val) => {
    const updated = [...formData.ossLinks];
    updated[i] = { ...updated[i], [key]: val };
    updateForm('ossLinks', updated);
  };
  const removeLink = (i) => updateForm('ossLinks', formData.ossLinks.filter((_, idx) => idx !== i));

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Open Source Contributions</h2>
      <p className={`mb-6 ${vc.textSec}`}>Share your open source work</p>
      <TextareaField label="Description" value={formData.ossDescription} onChange={v => updateForm('ossDescription', v)} placeholder="I contribute to React, Node.js, and various community projects..." rows={3} />
      <label className={`block text-sm font-medium mb-2 ${vc.text}`}>PR / Contribution Links (up to 5)</label>
      <div className="space-y-2 mb-3">
        {formData.ossLinks.map((l, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="text" value={l.label} onChange={e => updateLink(i, 'label', e.target.value)} placeholder="Label" className={`flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all ${vc.input}`} />
            <input type="text" value={l.url} onChange={e => updateLink(i, 'url', e.target.value)} placeholder="URL" className={`flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all ${vc.input}`} />
            <button onClick={() => removeLink(i)} className="p-1 hover:text-red-500" aria-label="Remove link"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      {formData.ossLinks.length < 5 && (
        <button onClick={addLink} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${vc.btnSec}`}>
          <Plus className="w-4 h-4" /> Add Link
        </button>
      )}
    </div>
  );
}
