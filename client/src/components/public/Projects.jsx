import React, { useState, useMemo } from 'react';
import { 
  Layers, ExternalLink, Github, BookOpen, Star, 
  ArrowUpRight, Sparkles, Filter, Code2, Cpu 
} from 'lucide-react';
import ProjectCaseStudyModal from './ProjectCaseStudyModal';
import { api } from '../../services/api';

export default function Projects({ projectsList }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);

  const projects = projectsList || [];

  const categories = useMemo(() => {
    const cats = ['All'];
    projects.forEach(p => {
      if (p.category && !cats.includes(p.category)) {
        cats.push(p.category);
      }
    });
    return cats;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter(p => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const handleOpenCaseStudy = async (project) => {
    setActiveCaseStudy(project);
    // Track project view telemetry
    api.trackEvent('project_click', 'view_case_study', { title: project.title, slug: project.slug });
  };

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-teal-400 uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5" />
              <span>05 // Selected Engineering Projects</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Real-World Systems & Architectures
            </h2>
            <p className="text-slate-400 max-w-2xl text-base">
              From full-stack web platforms and cloud APIs to embedded microcontroller telemetry nodes.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => {
            const techStack = Array.isArray(project.tech_stack)
              ? project.tech_stack
              : JSON.parse(project.tech_stack || '[]');

            const isMajorFeatured = project.slug === 'my-temple' || project.is_featured;

            return (
              <div
                key={project.id}
                className={`rounded-2xl bg-[#0d1424] border transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xl ${
                  isMajorFeatured
                    ? 'border-teal-500/40 hover:border-teal-400/80 ring-1 ring-teal-500/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                
                {/* Project Image Banner */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-800">
                  <img
                    src={project.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1424] via-transparent to-transparent opacity-90" />
                  
                  {/* Category & Featured Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded text-[11px] font-mono font-semibold bg-slate-900/85 backdrop-blur-md text-teal-300 border border-slate-700/80">
                      {project.category}
                    </span>
                    {project.is_featured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                        <Star className="w-3 h-3 fill-amber-300" />
                        Featured Architecture
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Project Card Content */}
                <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  {/* Problem Solved Teaser */}
                  {project.problem && (
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
                      <span className="font-mono text-teal-400 font-semibold block mb-0.5">
                        Problem Solved:
                      </span>
                      <p className="line-clamp-2">
                        {project.problem}
                      </p>
                    </div>
                  )}

                  {/* Tech Stack Pills */}
                  <div className="space-y-2 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800/90 text-slate-300 border border-slate-700/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => handleOpenCaseStudy(project)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 transition-colors font-mono"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Case Study</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
                          title="View GitHub Code"
                          aria-label="GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
                          title="Live Demo"
                          aria-label="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Case Study Deep-dive Modal */}
      {activeCaseStudy && (
        <ProjectCaseStudyModal
          project={activeCaseStudy}
          onClose={() => setActiveCaseStudy(null)}
        />
      )}
    </section>
  );
}
