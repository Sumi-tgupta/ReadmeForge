import React from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import SelectField from '../../../components/common/SelectField';
import { STAT_THEMES, DATE_FORMATS } from '../../../constants/options';

export default function StreakStep() {
  const { vc } = useTheme();
  const { formData, updateForm } = useGenerator();

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Streak Stats</h2>
      <p className={`mb-6 ${vc.textSec}`}>Show your contribution streak</p>
      <SelectField label="Theme" value={formData.streakTheme} onChange={v => updateForm('streakTheme', v)} options={STAT_THEMES} />
      <SelectField label="Date Format" value={formData.streakDateFormat} onChange={v => updateForm('streakDateFormat', v)} options={DATE_FORMATS} />
      {formData.username && (
        <div className="mt-4">
          <p className={`text-xs mb-2 ${vc.textSec}`}>Preview:</p>
          <img src={`https://streak-stats.demolab.com/?user=${formData.username}&theme=${formData.streakTheme}&date_format=${encodeURIComponent(formData.streakDateFormat)}`} alt="Streak Preview" className="max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
