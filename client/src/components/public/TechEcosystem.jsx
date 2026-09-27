import React, { useState } from 'react';
import { 
  Monitor, Server, Database, Globe, Wrench, Cpu, 
  ArrowDown, Sparkles, Layers, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function TechEcosystem() {
  const [activeLayer, setActiveLayer] = useState(0);

  const layers = [
    {
      id: 'frontend',
      title: '1. Frontend & Client Interfaces',
      icon: Monitor,
      color: 'teal',
      badge: 'User Experience & Reactive State',
      tech: ['React.js', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Responsive Design'],
      description: 'Engineered for sub-second first contentful paint, accessibility, and intuitive reactive user interfaces with modern component architectures.'
    },
    {
      id: 'api-gateway',
      title: '2. Backend Services & REST APIs',
      icon: Server,
      color: 'sky',
      badge: 'Business Logic & Contracts',
      tech: ['Core Java', 'Spring Boot', 'REST APIs', 'PHP'],
      description: 'Robust server-side services with layered architectures (Controller-Service-Repository), stateless JWT authentication, and secure request validation.'
    },
    {
      id: 'database',
      title: '3. Relational Data Layer',
      icon: Database,
      color: 'indigo',
      badge: 'Persistence & Transactional Integrity',
      tech: ['MySQL', 'Relational Schemas', 'Indexing', 'Query Optimization'],
      description: 'Structured database schemas designed with referential integrity, indexed query performance, connection pooling, and transactional consistency.'
    },
    {
      id: 'cms',
      title: '4. CMS & Content Platforms',
      icon: Globe,
      color: 'purple',
      badge: 'Enterprise Web Delivery',
      tech: ['WordPress', 'Webflow', 'Framer', 'Custom PHP Themes'],
      description: 'Production web platforms deployed at VDart, integrating custom headless frontend components, marketing analytics, and lead capture pipelines.'
    },
    {
      id: 'tools',
      title: '5. Developer Tooling & Verification',
      icon: Wrench,
      color: 'amber',
      badge: 'Quality & CI/CD Discipline',
      tech: ['Git', 'GitHub', 'Postman', 'Chrome DevTools', 'API Testing'],
      description: 'Rigorous version control, automated Postman test assertion collections, browser network inspection, and systematic debugging workflows.'
    },
    {
      id: 'hardware',
      title: '6. Embedded Systems & Electronics',
      icon: Cpu,
      color: 'emerald',
      badge: 'Physical Systems Foundation',
      tech: ['Microcontrollers', 'Digital Electronics', 'Analog Circuits', 'Hardware Troubleshooting'],
      description: 'Underlying hardware awareness from an Electronics & Communication Engineering degree, giving a distinct advantage in low-level systems and IoT integrations.'
    }
  ];

  const current = layers[activeLayer];
  const CurrentIcon = current.icon;

  return (
    <section id="tech-stack" className="py-20 bg-slate-950/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-2 mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-teal-400 uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            <span>04 // Full Stack & Hardware Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How My Engineering Stack Connects
          </h2>
          <p className="text-slate-400 max-w-2xl text-base">
            An interactive visualization showing data and logic flow from client interfaces down to hardware systems.
          </p>
        </div>

        {/* Interactive Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Stack Layers Navigation */}
          <div className="lg:col-span-7 space-y-3">
            {layers.map((layer, idx) => {
              const Icon = layer.icon;
              const isActive = activeLayer === idx;
              return (
                <div key={layer.id} className="relative">
                  <button
                    onClick={() => setActiveLayer(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                      isActive
                        ? 'bg-slate-900 border-teal-500/80 shadow-lg shadow-teal-500/10'
                        : 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2.5 rounded-lg border transition-colors ${
                          isActive
                            ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4
                          className={`text-sm font-semibold transition-colors ${
                            isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                          }`}
                        >
                          {layer.title}
                        </h4>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {layer.tech.slice(0, 3).map((t, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400"
                            >
                              {t}
                            </span>
                          ))}
                          {layer.tech.length > 3 && (
                            <span className="text-[10px] font-mono text-slate-500">
                              +{layer.tech.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isActive ? 'text-teal-400 translate-x-1' : 'text-slate-600'
                      }`}
                    />
                  </button>

                  {/* Flow arrow between layers */}
                  {idx < layers.length - 1 && (
                    <div className="flex justify-center my-0.5 text-slate-700">
                      <ArrowDown className="w-3.5 h-3.5 animate-bounce" style={{ animationDuration: '2s' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Layer Inspector Detail Panel */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="rounded-2xl p-6 sm:p-7 bg-[#0d1424] border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
              
              {/* Subtle Layer Accent Glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/10 blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                  <CurrentIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider block">
                    {current.badge}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {current.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Associated Technologies & Protocols:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {current.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800/90 text-teal-300 border border-slate-700/80 shadow-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-teal-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Engineering Bridge</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Unlike purely high-level developers, my background links higher-layer abstractions (React state, Spring Boot controllers) with lower-layer understanding (memory footprints, I/O protocols, concurrency, and digital logic).
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
