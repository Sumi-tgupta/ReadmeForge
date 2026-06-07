import React from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import InputField from '../../../components/common/InputField';

export default function SupportStep() {
  const { vc } = useTheme();
  const { formData, updateForm } = useGenerator();

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Support / Sponsor Me</h2>
      <p className={`mb-6 ${vc.textSec}`}>Let people support your work</p>
      <InputField label="Buy Me a Coffee Username" value={formData.bmcUsername} onChange={v => updateForm('bmcUsername', v)} placeholder="yourusername" />
      <InputField label="Ko-fi Username" value={formData.kofiUsername} onChange={v => updateForm('kofiUsername', v)} placeholder="yourusername" />
      <InputField label="GitHub Sponsors Username" value={formData.ghSponsors} onChange={v => updateForm('ghSponsors', v)} placeholder="yourusername" />
      <InputField label="Patreon URL" value={formData.patreonUrl} onChange={v => updateForm('patreonUrl', v)} placeholder="https://patreon.com/yourusername" />
    </div>
  );
}
