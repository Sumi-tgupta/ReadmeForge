import React from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import InputField from '../../../components/common/InputField';

export default function CustomStep() {
  const { vc } = useTheme();
  const { formData, updateForm } = useGenerator();

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Custom Section</h2>
      <p className={`mb-6 ${vc.textSec}`}>Add any custom markdown content</p>
      <InputField label="Section Title" value={formData.customTitle} onChange={v => updateForm('customTitle', v)} placeholder="My Custom Section" />
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-1.5 ${vc.text}`}>Markdown Content</label>
        <textarea
          value={formData.customContent}
          onChange={e => updateForm('customContent', e.target.value)}
          placeholder="Raw markdown — anything you type here goes in as-is."
          rows={8}
          className={`w-full px-4 py-3 rounded-lg font-mono text-sm transition-all outline-none resize-none ${vc.input}`}
        />
        <p className={`text-xs mt-1 ${vc.textSec}`}>Raw markdown — anything you type here goes in as-is.</p>
      </div>
    </div>
  );
}
