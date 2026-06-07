import React from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import TechPicker from '../TechPicker';

export default function TechStackStep() {
  const { vc } = useTheme();
  const { formData, updateForm, toggleTech } = useGenerator();

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Tech Stack & Tools</h2>
      <p className={`mb-6 ${vc.textSec}`}>Select your technologies and preferred badge style</p>

      <div className="mb-6">
        <label className={`block text-sm font-medium mb-2 ${vc.text}`}>Badge Style</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'shields', name: 'Shields.io Badges', desc: 'Colorful pill-shaped badges' },
            { id: 'skillicons', name: 'Skill Icons', desc: 'Clean logo icons from skillicons.dev' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => updateForm('badgeStyle', opt.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left active:scale-95 ${
                formData.badgeStyle === opt.id
                  ? vc.selectedCard
                  : `${vc.card} border-transparent hover:shadow-md`
              }`}
            >
              <p className={`font-semibold text-sm mb-1 ${vc.text}`}>{opt.name}</p>
              <p className={`text-xs ${vc.textSec}`}>{opt.desc}</p>
              {opt.id === 'shields' && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" className="h-5" />
                  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" className="h-5" />
                </div>
              )}
              {opt.id === 'skillicons' && (
                <div className="mt-2">
                  <img src="https://skillicons.dev/icons?i=react,nodejs,ts" alt="Skills" className="h-8" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <TechPicker selected={formData.selectedTechs} onToggle={toggleTech} title="Select Technologies" />
    </div>
  );
}
