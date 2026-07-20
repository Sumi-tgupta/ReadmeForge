import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Monitor, Layers } from 'lucide-react';

/**
 * Products section — two builder cards side by side.
 * Memoized so it never re-renders from parent state changes (dropdown, mockup step, etc.)
 */
export const ProductsSection = memo(function ProductsSection() {
  const navigate = useNavigate();

  const products = [
    {
      icon: <Monitor className="w-6 h-6" />,
      title: 'GitHub Profile README',
      desc: 'Create stunning profile READMEs using guided wizard inputs for work experience, hobbies, skills, trophies, and stats.',
      cta: 'Open Builder',
      path: '/profile-builder',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'Project README Generator',
      desc: 'Analyze any public GitHub repository, crawl its technology stack, and draft production-quality repo documentation automatically.',
      cta: 'Analyze Repository',
      path: '/project-builder',
    },
  ];

  return (
    <section id="products" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
          Choose Your Documentation Engine
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          Select one of our specialized builder tools to construct developer assets.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {products.map((p) => (
          <div
            key={p.path}
            onClick={() => navigate(p.path)}
            className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 cursor-pointer shadow-sm hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:border-indigo-450/50 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-650 dark:text-indigo-400">
                {p.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white">{p.title}</h3>
              <p className="text-gray-650 dark:text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-650 dark:text-indigo-400 mt-8 group-hover:underline">
              {p.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
