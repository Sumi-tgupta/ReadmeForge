import React from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import SelectField from '../../../components/common/SelectField';
import { TROPHY_THEMES, TROPHY_RANKS } from '../../../constants/options';

export default function TrophiesStep() {
  const { vc } = useTheme();
  const { formData, updateForm } = useGenerator();

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>GitHub Trophies</h2>
      <p className={`mb-6 ${vc.textSec}`}>Display your achievement trophies</p>
      <SelectField label="Theme" value={formData.trophyTheme} onChange={v => updateForm('trophyTheme', v)} options={TROPHY_THEMES} />
      <SelectField label="Rank Filter" value={formData.trophyRank} onChange={v => updateForm('trophyRank', v)} options={TROPHY_RANKS} />
      {formData.username && (
        <div className="mt-4">
          <p className={`text-xs mb-2 ${vc.textSec}`}>Preview:</p>
          <img src={`https://github-profile-trophy.vercel.app/?username=${formData.username}&theme=${formData.trophyTheme}${formData.trophyRank !== 'All' ? `&rank=${formData.trophyRank}` : ''}&no-frame=true&margin-w=10`} alt="Trophies Preview" className="max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
