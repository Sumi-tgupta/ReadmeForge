import React from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import { SECTION_DEFS } from '../../../constants/sections';

/**
 * Step 2: Section selector — pick which sections to include in the README.
 */
export default function SectionSelectorStep() {
  const { vc, isDark } = useTheme();
  const { selectedSections, toggleSection } = useGenerator();

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>What would you like on your README?</h2>
      <p className={`mb-6 ${vc.textSec}`}>Pick the sections to include. You can reorder them after.</p>

      <div className="space-y-2">
        {SECTION_DEFS.map(sec => {
          const isSelected = selectedSections.includes(sec.key);
          const Icon = sec.icon;
          return (
            <button
              key={sec.key}
              onClick={() => toggleSection(sec.key)}
              disabled={sec.required}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left border-2 ${
                isSelected ? vc.selectedCard : `${vc.card} border-transparent`
              } ${sec.required ? 'opacity-90' : 'hover:shadow-md active:scale-[0.99]'}`}
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                isSelected
                  ? 'bg-green-500'
                  : isDark ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-300'
              }`}>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
              <Icon className={`w-5 h-5 flex-shrink-0 ${vc.accent}`} />
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${vc.text}`}>
                  {sec.name}
                  {sec.required && (
                    <span className={`ml-2 text-xs font-normal ${vc.textSec}`}>(Required)</span>
                  )}
                </p>
                <p className={`text-xs ${vc.textSec}`}>{sec.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
