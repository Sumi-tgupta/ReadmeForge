import React from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import { SOCIAL_PLATFORMS } from '../../../constants/socials';

export default function SocialStep() {
  const { vc, isDark } = useTheme();
  const { formData, updateSocial } = useGenerator();

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Social Links & Contact</h2>
      <p className={`mb-6 ${vc.textSec}`}>Add your social profiles (fill in only the ones you use)</p>
      <div className="space-y-3">
        {SOCIAL_PLATFORMS.map(platform => {
          const Icon = platform.icon;
          return (
            <div key={platform.id} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Icon className={`w-4 h-4 ${vc.accent}`} />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.social[platform.id]}
                  onChange={e => updateSocial(platform.id, e.target.value)}
                  placeholder={platform.name}
                  className={`w-full px-3 py-2 rounded-lg text-sm outline-none transition-all ${vc.input}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
