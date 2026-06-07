import React from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import TextareaField from '../../../components/common/TextareaField';
import { HOBBY_OPTIONS } from '../../../constants/options';

export default function HobbiesStep() {
  const { vc, isDark } = useTheme();
  const { formData, updateForm } = useGenerator();

  const toggleHobby = (h) => {
    const current = formData.hobbies;
    updateForm('hobbies', current.includes(h) ? current.filter(x => x !== h) : [...current, h]);
  };

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Hobbies & Fun Facts</h2>
      <p className={`mb-6 ${vc.textSec}`}>Share your interests</p>
      <TextareaField
        label="Fun Facts (bullet points)"
        value={formData.funFacts}
        onChange={v => updateForm('funFacts', v)}
        placeholder={"- I love hiking in the mountains\n- Coffee fuels my coding sessions\n- I've visited 15 countries"}
        rows={4}
      />
      <label className={`block text-sm font-medium mb-2 ${vc.text}`}>Hobbies</label>
      <div className="flex flex-wrap gap-2">
        {HOBBY_OPTIONS.map(h => (
          <button
            key={h}
            onClick={() => toggleHobby(h)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
              formData.hobbies.includes(h)
                ? vc.tabActive
                : vc.tabInactive + ' border ' + (isDark ? 'border-gray-700' : 'border-gray-200')
            }`}
          >
            {h}
          </button>
        ))}
      </div>
      {formData.hobbies.length > 0 && (
        <p className={`text-xs mt-2 ${vc.textSec}`}>Selected: {formData.hobbies.join(', ')}</p>
      )}
    </div>
  );
}
