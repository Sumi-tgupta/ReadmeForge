import React from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import InputField from '../../../components/common/InputField';
import TextareaField from '../../../components/common/TextareaField';
import ToggleSwitch from '../../../components/common/ToggleSwitch';

export default function AboutMeStep() {
  const { vc } = useTheme();
  const { formData, updateForm } = useGenerator();

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>About Me</h2>
      <p className={`mb-6 ${vc.textSec}`}>Write a brief introduction</p>
      <TextareaField label="Bio" value={formData.bio} onChange={v => updateForm('bio', v)} placeholder="A passionate developer who loves building things..." maxLen={500} rows={3} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <InputField label="Pronouns" value={formData.pronouns} onChange={v => updateForm('pronouns', v)} placeholder="he/him, she/her, they/them" />
        <InputField label="Current Focus" value={formData.currentFocus} onChange={v => updateForm('currentFocus', v)} placeholder="Building scalable React apps" />
      </div>
      <InputField label="Fun Fact" value={formData.funFact} onChange={v => updateForm('funFact', v)} placeholder="I can solve a Rubik's cube in under 2 minutes!" />
      <ToggleSwitch label="Open to work?" value={formData.openToWork} onChange={v => updateForm('openToWork', v)} />
    </div>
  );
}
