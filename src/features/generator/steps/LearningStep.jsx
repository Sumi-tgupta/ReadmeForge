import React from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import InputField from '../../../components/common/InputField';
import TechPicker from '../TechPicker';

export default function LearningStep() {
  const { vc } = useTheme();
  const { formData, updateForm, toggleLearningTech } = useGenerator();

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Currently Learning</h2>
      <p className={`mb-6 ${vc.textSec}`}>What technologies are you exploring?</p>
      <TechPicker selected={formData.learningTechs} onToggle={toggleLearningTech} title="Select Technologies" />
      <div className="mt-4">
        <InputField label="Goal / Timeline" value={formData.learningGoal} onChange={v => updateForm('learningGoal', v)} placeholder="Mastering Rust by Q3 2025" />
      </div>
    </div>
  );
}
