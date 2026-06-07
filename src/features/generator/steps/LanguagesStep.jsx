import React from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import SelectField from '../../../components/common/SelectField';
import InputField from '../../../components/common/InputField';
import { STAT_THEMES, LANG_LAYOUTS } from '../../../constants/options';

export default function LanguagesStep() {
  const { vc } = useTheme();
  const { formData, updateForm } = useGenerator();

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Top Languages Card</h2>
      <p className={`mb-6 ${vc.textSec}`}>Visualize your most-used languages</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <SelectField label="Layout" value={formData.langLayout} onChange={v => updateForm('langLayout', v)} options={LANG_LAYOUTS} />
        <SelectField label="Theme" value={formData.langTheme} onChange={v => updateForm('langTheme', v)} options={STAT_THEMES} />
      </div>
      <InputField label="Exclude Repos" value={formData.langExcludeRepos} onChange={v => updateForm('langExcludeRepos', v)} placeholder="repo1,repo2" />
      <InputField label="Hide Languages" value={formData.langHideLanguages} onChange={v => updateForm('langHideLanguages', v)} placeholder="html,css" />
      {formData.username && (
        <div className="mt-4">
          <p className={`text-xs mb-2 ${vc.textSec}`}>Preview:</p>
          <img src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${formData.username}&theme=${formData.langTheme}&layout=${formData.langLayout}`} alt="Languages Preview" className="max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
