import React from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import SelectField from '../../../components/common/SelectField';
import ToggleSwitch from '../../../components/common/ToggleSwitch';
import { STAT_THEMES } from '../../../constants/options';

export default function StatsStep() {
  const { vc } = useTheme();
  const { formData, updateForm } = useGenerator();

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>GitHub Stats & Activity</h2>
      <p className={`mb-6 ${vc.textSec}`}>Configure your stats cards</p>
      <SelectField label="Stats Theme" value={formData.statsTheme} onChange={v => updateForm('statsTheme', v)} options={STAT_THEMES} />
      <ToggleSwitch label="Show Stats Card" value={formData.showStatsCard} onChange={v => updateForm('showStatsCard', v)} />
      <ToggleSwitch label="Show Contributions Graph" value={formData.showContribGraph} onChange={v => updateForm('showContribGraph', v)} />
      <div className={`p-4 rounded-xl ${vc.card}`}>
        <p className={`text-sm font-medium mb-3 ${vc.text}`}>Hide Stats</p>
        <div className="space-y-2">
          <ToggleSwitch label="Stars" value={formData.hideStars} onChange={v => updateForm('hideStars', v)} />
          <ToggleSwitch label="Commits" value={formData.hideCommits} onChange={v => updateForm('hideCommits', v)} />
          <ToggleSwitch label="PRs" value={formData.hidePRs} onChange={v => updateForm('hidePRs', v)} />
          <ToggleSwitch label="Issues" value={formData.hideIssues} onChange={v => updateForm('hideIssues', v)} />
          <ToggleSwitch label="Contributions" value={formData.hideContribs} onChange={v => updateForm('hideContribs', v)} />
        </div>
      </div>
      {formData.username && (
        <div className="mt-4">
          <p className={`text-xs mb-2 ${vc.textSec}`}>Preview:</p>
          <img src={`https://github-readme-stats.vercel.app/api?username=${formData.username}&theme=${formData.statsTheme}&show_icons=true`} alt="" className="max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
