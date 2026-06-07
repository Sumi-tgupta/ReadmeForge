import React, { useState, useMemo } from 'react';
import { Search, Check, X } from 'lucide-react';
import { useTheme } from '../../app/providers/ThemeProvider';
import { UNIQUE_TECHS, TECH_CATEGORIES } from '../../constants/techs';

/**
 * Searchable, filterable tech selector grid.
 * Used for both "Tech Stack" and "Currently Learning" steps.
 */
export default function TechPicker({ selected, onToggle, title }) {
  const { vc } = useTheme();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');

  const filtered = useMemo(() => {
    return UNIQUE_TECHS.filter(t => {
      const matchCat = activeCat === 'All' || t.cat === activeCat;
      const matchSearch = !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCat]);

  return (
    <div>
      {title && (
        <label className={`block text-sm font-medium mb-2 ${vc.text}`}>{title}</label>
      )}

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 mb-3">
        {TECH_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeCat === cat ? vc.tabActive : vc.tabInactive
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${vc.textSec}`} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search technologies..."
          className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all outline-none ${vc.input}`}
        />
      </div>

      {/* Tech grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-1">
        {filtered.map(tech => {
          const isSelected = selected.includes(tech.uniqueKey);
          return (
            <button
              key={tech.uniqueKey}
              onClick={() => onToggle(tech.uniqueKey)}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all border-2 hover:scale-105 active:scale-95 ${
                isSelected
                  ? vc.selectedCard
                  : `${vc.card} border-transparent hover:border-gray-300`
              }`}
            >
              {isSelected && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center animate-pop">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <img
                src={`https://skillicons.dev/icons?i=${tech.iconId || tech.id}&theme=light`}
                alt={tech.name}
                className="w-8 h-8 object-contain"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <span className={`truncate w-full text-center ${vc.text}`}>{tech.name}</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className={`col-span-full text-center py-8 ${vc.textSec}`}>No technologies found</p>
        )}
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
          {selected.map(id => {
            const tech = UNIQUE_TECHS.find(t => t.uniqueKey === id);
            return tech ? (
              <span key={id} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium animate-pop ${vc.chip}`}>
                {tech.name}
                <button onClick={() => onToggle(id)} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
