import React from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import InputField from '../../../components/common/InputField';
import SelectField from '../../../components/common/SelectField';
import { TONE_OPTIONS, AVATAR_STYLES } from '../../../constants/options';

/**
 * Step 1: Basic user info — name, username, tagline, location, etc.
 */
export default function BasicInfoStep() {
  const { vc, fontClass } = useTheme();
  const { formData, updateForm } = useGenerator();

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Welcome! Let's get started</h2>
      <p className={`mb-6 ${vc.textSec}`}>Tell us a bit about yourself</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <InputField label="Full Name" value={formData.name} onChange={v => updateForm('name', v)} placeholder="John Doe" required />
        <InputField label="GitHub Username" value={formData.username} onChange={v => updateForm('username', v)} placeholder="johndoe" required />
      </div>

      <InputField label="Tagline / Role" value={formData.tagline} onChange={v => updateForm('tagline', v)} placeholder="Full Stack Developer | Open Source Enthusiast" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <InputField label="Location" value={formData.location} onChange={v => updateForm('location', v)} placeholder="San Francisco, CA" />
        <InputField label="Email" value={formData.email} onChange={v => updateForm('email', v)} placeholder="john@example.com" type="email" />
      </div>

      <InputField label="Website / Portfolio URL" value={formData.website} onChange={v => updateForm('website', v)} placeholder="https://johndoe.dev" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <SelectField label="Profile Tone" value={formData.tone} onChange={v => updateForm('tone', v)} options={TONE_OPTIONS} />
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1.5 ${vc.text}`}>Header Style</label>
          <select
            value={formData.avatarStyle}
            onChange={e => updateForm('avatarStyle', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg transition-all outline-none ${fontClass} ${vc.input}`}
          >
            {AVATAR_STYLES.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
