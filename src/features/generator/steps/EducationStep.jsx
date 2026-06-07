import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useGenerator } from '../../../hooks/useGenerator';
import InputField from '../../../components/common/InputField';

export default function EducationStep() {
  const { vc } = useTheme();
  const { formData, updateForm } = useGenerator();

  // Education helpers
  const addEdu = () => {
    if (formData.educationEntries.length < 3) updateForm('educationEntries', [...formData.educationEntries, { institution: '', degree: '', year: '' }]);
  };
  const updateEdu = (i, key, val) => {
    const updated = [...formData.educationEntries];
    updated[i] = { ...updated[i], [key]: val };
    updateForm('educationEntries', updated);
  };
  const removeEdu = (i) => updateForm('educationEntries', formData.educationEntries.filter((_, idx) => idx !== i));

  // Certification helpers
  const addCert = () => {
    if (formData.certifications.length < 6) updateForm('certifications', [...formData.certifications, { name: '', issuer: '', year: '', url: '' }]);
  };
  const updateCert = (i, key, val) => {
    const updated = [...formData.certifications];
    updated[i] = { ...updated[i], [key]: val };
    updateForm('certifications', updated);
  };
  const removeCert = (i) => updateForm('certifications', formData.certifications.filter((_, idx) => idx !== i));

  return (
    <div className="animate-fade-in">
      <h2 className={`text-2xl font-bold mb-1 ${vc.text}`}>Certifications & Education</h2>
      <p className={`mb-6 ${vc.textSec}`}>Your academic credentials</p>

      <h3 className={`text-lg font-semibold mb-3 ${vc.text}`}>Education</h3>
      <div className="space-y-3 mb-4">
        {formData.educationEntries.map((e, i) => (
          <div key={i} className={`p-4 rounded-xl ${vc.card}`}>
            <div className="flex justify-end mb-2">
              <button onClick={() => removeEdu(i)} className="p-1 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3">
              <InputField label="Institution" value={e.institution} onChange={v => updateEdu(i, 'institution', v)} placeholder="MIT" />
              <InputField label="Degree" value={e.degree} onChange={v => updateEdu(i, 'degree', v)} placeholder="B.S. Computer Science" />
              <InputField label="Year" value={e.year} onChange={v => updateEdu(i, 'year', v)} placeholder="2024" />
            </div>
          </div>
        ))}
      </div>
      {formData.educationEntries.length < 3 && (
        <button onClick={addEdu} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mb-6 transition-all active:scale-95 ${vc.btnSec}`}>
          <Plus className="w-4 h-4" /> Add Education
        </button>
      )}

      <h3 className={`text-lg font-semibold mb-3 ${vc.text}`}>Certifications</h3>
      <div className="space-y-3 mb-4">
        {formData.certifications.map((c, i) => (
          <div key={i} className={`p-4 rounded-xl ${vc.card}`}>
            <div className="flex justify-end mb-2">
              <button onClick={() => removeCert(i)} className="p-1 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
              <InputField label="Name" value={c.name} onChange={v => updateCert(i, 'name', v)} placeholder="AWS Solutions Architect" />
              <InputField label="Issuer" value={c.issuer} onChange={v => updateCert(i, 'issuer', v)} placeholder="Amazon" />
              <InputField label="Year" value={c.year} onChange={v => updateCert(i, 'year', v)} placeholder="2024" />
              <InputField label="URL" value={c.url} onChange={v => updateCert(i, 'url', v)} placeholder="https://credential.url" />
            </div>
          </div>
        ))}
      </div>
      {formData.certifications.length < 6 && (
        <button onClick={addCert} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${vc.btnSec}`}>
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      )}
    </div>
  );
}
