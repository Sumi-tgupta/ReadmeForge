import React, { useState } from 'react';
import { Award, Plus, Copy, Check, Palette } from 'lucide-react';

const PRESET_BADGES = [
  { label: 'License', val: 'MIT', color: 'blue', style: 'for-the-badge' },
  { label: 'Build', val: 'passing', color: 'success', style: 'for-the-badge' },
  { label: 'Version', val: 'v1.0.0', color: 'orange', style: 'for-the-badge' },
  { label: 'Coverage', val: '98%', color: 'brightgreen', style: 'for-the-badge' },
  { label: 'PRs', val: 'welcome', color: 'brightgreen', style: 'for-the-badge' }
];

export default function BadgeConfigurator({ onInsertBadge }) {
  const [label, setLabel] = useState('License');
  const [val, setVal] = useState('MIT');
  const [color, setColor] = useState('blue');
  const [style, setStyle] = useState('for-the-badge');
  const [copied, setCopied] = useState(false);

  const badgeUrl = `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(val)}-${color}.svg?style=${style}`;
  const markdownSnippet = `![${label}](${badgeUrl})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (onInsertBadge) {
      onInsertBadge(markdownSnippet);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2 text-indigo-300">
          <Award className="w-4 h-4 text-indigo-400" />
          Shields.io Badge Configurator
        </h4>
        <span className="text-xs text-slate-400">Interactive Generator</span>
      </div>

      {/* Live Badge Preview */}
      <div className="bg-slate-950 p-4 rounded-lg flex items-center justify-center border border-slate-800">
        <img src={badgeUrl} alt={label} className="h-7 object-contain" />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Value</label>
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Color</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="blue">Blue</option>
            <option value="brightgreen">Bright Green</option>
            <option value="success">Success Green</option>
            <option value="orange">Orange</option>
            <option value="red">Red</option>
            <option value="purple">Purple</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="for-the-badge">For-the-Badge</option>
            <option value="flat">Flat</option>
            <option value="flat-square">Flat Square</option>
            <option value="plastic">Plastic</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 pt-1">
        <button
          onClick={handleInsert}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-1.5 px-3 rounded-md text-xs flex items-center justify-center space-x-1 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Insert into README</span>
        </button>
        <button
          onClick={handleCopy}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-1.5 px-3 rounded-md text-xs flex items-center space-x-1 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}
