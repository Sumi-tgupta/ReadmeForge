import React, { memo } from 'react';
import { Cpu, FileText, ShieldCheck, Copy, Sparkles, Download } from 'lucide-react';

const features = [
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'Repository Intelligence',
    desc: 'Scans repository layouts, folder maps, package.json dependencies, and licenses to write accurate, helpful summaries.',
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Markdown Preview',
    desc: 'Simulate a live, fully-styled GitHub dark/light mode markdown container to verify your README output matches the web.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'GitHub Ready',
    desc: 'Uses certified styles, icons, badges, stats cards, and trophies that fit seamlessly into GitHub profile layouts.',
  },
  {
    icon: <Copy className="w-5 h-5" />,
    title: 'One-Click Copy',
    desc: 'Instantly copy the generated markdown code block or export it directly to save time setting up your repositories.',
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'AI Powered',
    desc: 'Leverages the server-side Google Gemini models to construct highly expressive, clear, and structured copy.',
  },
  {
    icon: <Download className="w-5 h-5" />,
    title: 'Export Markdown',
    desc: 'Download README.md files directly to your hard drive to version control them alongside your application source code.',
  },
];

/**
 * Feature grid section — static content, memoized.
 */
export const FeaturesSection = memo(function FeaturesSection() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
          Built for Modern Developer Workflows
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          All the configurations, templates, and analytics to optimize your GitHub developer profile.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((item) => (
          <div
            key={item.title}
            className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-4 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 text-left transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
              {item.icon}
            </div>
            <h3 className="text-base font-bold text-gray-950 dark:text-white">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
});
