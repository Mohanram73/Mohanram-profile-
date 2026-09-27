import React, { useState } from 'react';
import { 
  X, ExternalLink, Github, CheckCircle2, AlertTriangle, 
  Cpu, Layers, Sparkles, Database, Navigation, Compass, ArrowRight
} from 'lucide-react';

export default function ProjectCaseStudyModal({ project, onClose }) {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState('overview');

  const techStack = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : JSON.parse(project.tech_stack || '[]');

  const features = Array.isArray(project.features)
    ? project.features
    : JSON.parse(project.features || '[]');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0c1322] border border-slate-700/80 shadow-2xl text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0c1322]/95 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">
              {project.category}
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              // Technical Case Study
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Hero / Header Banner */}
        <div className="relative p-6 sm:p-8 space-y-4 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/80 to-transparent">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {project.title}
          </h2>
          <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
            {project.summary}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono shadow-md shadow-teal-500/20"
              >
                <span>Live Project Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                <Github className="w-3.5 h-3.5 text-teal-400" />
                <span>Source Repository</span>
              </a>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 border-b border-slate-800 bg-slate-950/40 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Problem & Approach
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. System Architecture
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'challenges'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Challenges & Solution
          </button>
          <button
            onClick={() => setActiveTab('outcome')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'outcome'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Impact & Result
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: Problem & Approach */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Problem Statement */}
              <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-800/30 space-y-2">
                <h4 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>The Engineering Problem Solved</span>
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {project.problem}
                </p>
              </div>

              {/* Engineering Approach */}
              <div className="p-5 rounded-xl bg-teal-950/20 border border-teal-800/30 space-y-2">
                <h4 className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-teal-400" />
                  <span>Strategic Technical Approach</span>
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {project.approach}
                </p>
              </div>

              {/* Key Features List */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Engineered Platform Features:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>Architectural Pipeline Breakdown</span>
                </h4>
                <div className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed">
                  {project.architecture}
                </div>
              </div>

              {/* Special VDart System Architecture Blueprint if slug is vdart-corporate-website */}
              {project.slug === 'vdart-corporate-website' && (
                <div className="p-5 rounded-xl bg-[#0a0f1d] border border-slate-800 space-y-4">
                  <h4 className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
                    VDart Enterprise Web &amp; Gemini AI Chatbot Blueprint:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div className="p-3 rounded-lg bg-slate-900 border border-teal-500/40">
                      <span className="text-teal-400 font-bold block">Frontend UI</span>
                      <span className="text-[11px] text-slate-400">WordPress Theme + HTML/CSS/JS</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-sky-500/40">
                      <span className="text-sky-400 font-bold block">AI Microservice</span>
                      <span className="text-[11px] text-slate-400">Node.js / Express</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-indigo-500/40">
                      <span className="text-indigo-400 font-bold block">AI Engine</span>
                      <span className="text-[11px] text-slate-400">Google Gemini API</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-amber-500/40">
                      <span className="text-amber-400 font-bold block">Analytics &amp; Forms</span>
                      <span className="text-[11px] text-slate-400">GA4, GSC, HubSpot &amp; SMTP</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Technology Badges */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Technology Stack:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 text-teal-300 border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Challenges & Solution */}
          {activeTab === 'challenges' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Technical Hurdles & Bottlenecks</span>
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {project.challenges}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-teal-950/20 border border-teal-800/30 space-y-2">
                <h4 className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>Engineered Solution</span>
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {project.solution}
                </p>
              </div>

            </div>
          )}

          {/* TAB 4: Outcome & Result */}
          {activeTab === 'outcome' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-950/30 to-slate-900/80 border border-emerald-800/40 space-y-3">
                <h4 className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Quantified Engineering Results</span>
                </h4>
                <p className="text-base text-slate-200 leading-relaxed">
                  {project.result}
                </p>
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-mono text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
                >
                  Close Case Study
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
