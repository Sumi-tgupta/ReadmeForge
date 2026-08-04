import React from 'react';
import { ListOrdered, MoveUp, MoveDown, PlusCircle, Trash2 } from 'lucide-react';

const CUSTOM_TEMPLATES = [
  {
    title: '⚡ Benchmarks & Performance',
    markdown: `\n## ⚡ Performance Benchmarks\n\n| Operation | Latency (p99) | Throughput (ops/sec) |\n| :--- | :--- | :--- |\n| Single Read | 1.2ms | 120,000 |\n| Batch Write | 4.8ms | 45,000 |\n`
  },
  {
    title: '❓ Frequently Asked Questions',
    markdown: `\n## ❓ FAQ\n\n<details>\n<summary><b>Can I deploy this on serverless environments?</b></summary>\n\nYes! README Forge is designed to run seamlessly on Vercel, Render, or Docker containers.\n</details>\n`
  },
  {
    title: '🌐 API Reference Table',
    markdown: `\n## 🌐 API Endpoints\n\n| Method | Endpoint | Description | Auth Required |\n| :--- | :--- | :--- | :--- |\n| \`POST\` | \`/api/generate/project\` | Executes Multi-Agent DAG Orchestrator | Optional |\n| \`GET\` | \`/api/generate/agent-stream\` | Streams real-time agent execution events | No |\n`
  }
];

export default function SectionOrganizer({ onInsertSection }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2 text-indigo-300">
          <ListOrdered className="w-4 h-4 text-indigo-400" />
          Section Organizer &amp; Templates
        </h4>
        <span className="text-xs text-slate-400">Custom Modules</span>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-slate-400 font-medium">Quick Insert Modular Templates</div>
        {CUSTOM_TEMPLATES.map((tmpl, idx) => (
          <button
            key={idx}
            onClick={() => onInsertSection && onInsertSection(tmpl.markdown)}
            className="w-full text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-indigo-500/50 p-2.5 rounded-lg flex items-center justify-between text-xs text-slate-200 transition group"
          >
            <span>{tmpl.title}</span>
            <PlusCircle className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
}
