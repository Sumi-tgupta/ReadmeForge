import React from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import InputField from '../../../components/common/InputField';

export default function VisitorStep() {
  const { vc } = useTheme();
  const { formData, updateForm } = useGenerator();

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Visitor Counter</h2>
      <p className={`mb-6 ${vc.textSec}`}>Track profile visits</p>
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${vc.text}`}>Style</label>
        <div className="flex gap-3">
          {['badge', 'counter'].map(s => (
            <button
              key={s}
              onClick={() => updateForm('visitorStyle', s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 active:scale-95 ${
                formData.visitorStyle === s ? vc.selectedCard : `${vc.card} border-transparent`
              }`}
            >
              {s === 'badge' ? 'Badge' : 'Markdown Counter'}
            </button>
          ))}
        </div>
      </div>
      <InputField label="Counter Label" value={formData.visitorLabel} onChange={v => updateForm('visitorLabel', v)} placeholder="Profile Views" />
      {formData.username && (
        <div className="mt-4">
          <p className={`text-xs mb-2 ${vc.textSec}`}>Preview:</p>
          <img
            src={`https://komarev.com/ghpvc/?username=${formData.username}&label=${encodeURIComponent(formData.visitorLabel || 'Profile Views')}&color=blue&style=for-the-badge`}
            alt="Visitor Counter Preview"
            className="h-7"
          />
        </div>
      )}
    </div>
  );
}
