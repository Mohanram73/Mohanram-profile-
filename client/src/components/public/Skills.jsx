import React, { useState, useMemo } from 'react';
import { 
  Code2, Cpu, Database, Globe, Wrench, CheckCircle2, 
  Search, Sparkles, Filter, Terminal, Layers
} from 'lucide-react';

const LEVEL_CONFIG = {
  Professional: {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-400',
    desc: 'Production-tested, everyday professional delivery'
  },
  Strong: {
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    dot: 'bg-sky-400',
    desc: 'Solid engineering competency and project execution'
  },
  'Working Knowledge': {
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    dot: 'bg-indigo-400',
    desc: 'Practical application and hands-on familiarity'
  },
  Fundamental: {
    badge: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    dot: 'bg-slate-400',
    desc: 'Foundational concepts and engineering principles'
  }
};

export default function Skills({ skillsList }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const skills = skillsList || [];

  const categories = useMemo(() => {
    const cats = ['All'];
    skills.forEach(s => {
      if (s.category && !cats.includes(s.category)) {
        cats.push(s.category);
      }
    });
    return cats;
  }, [skills]);

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchCat = selectedCategory === 'All' || skill.category === selectedCategory;
      const matchQuery = !searchQuery || skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || skill.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [skills, selectedCategory, searchQuery]);

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-2 mb-10">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-teal-400 uppercase tracking-widest">
            <Code2 className="w-3.5 h-3.5" />
            <span>03 // Technical Skills Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Categorized Engineering Competencies
          </h2>
          <p className="text-slate-400 max-w-2xl text-base">
            Qualitative proficiency levels based on genuine production experience and engineering fundamentals &mdash; no arbitrary percentage meters.
          </p>
        </div>

        {/* Legend for Proficiency Levels */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono mb-8">
          <span className="text-slate-400 mr-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-teal-400" />
            Proficiency Levels:
          </span>
          {Object.entries(LEVEL_CONFIG).map(([level, config]) => (
            <span
              key={level}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${config.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
              <span>{level}</span>
            </span>
          ))}
        </div>

        {/* Filter Controls: Search & Category Pills */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill, idx) => {
            const levelInfo = LEVEL_CONFIG[skill.proficiency_level] || LEVEL_CONFIG['Working Knowledge'];
            return (
              <div
                key={skill.id || idx}
                className="p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition-all duration-200 group flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      {skill.category}
                    </span>
                    <h3 className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors">
                      {skill.name}
                    </h3>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${levelInfo.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${levelInfo.dot}`}></span>
                    <span>{skill.proficiency_level}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-slate-400 font-mono text-xs">
            No technologies found matching "{searchQuery}" in category "{selectedCategory}".
          </div>
        )}

      </div>
    </section>
  );
}
