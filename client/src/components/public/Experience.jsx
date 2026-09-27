import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle, Tag, Trophy, ArrowRight } from 'lucide-react';

export default function Experience({ experienceList }) {
  const experiences = experienceList && experienceList.length > 0 ? experienceList : [
    {
      id: 1,
      company: 'VDart',
      position: 'Associate - WordPress Developer',
      employment_type: 'Full-time',
      start_date: '2023',
      end_date: null,
      is_current: 1,
      location: 'Trichy, India',
      responsibilities: [
        'WordPress website development and frontend architecture utilizing HTML5, CSS3, and JavaScript.',
        'Continuous website maintenance, cross-browser compatibility debugging, and performance optimization.',
        'Technical SEO implementation, structured data schema, and search performance tuning.',
        'Full digital analytics integration with Google Analytics 4, Search Console, and UTM campaign tracking.',
        'Lead intake forms integration, sanitization, and enterprise transactional email relay via SMTP.',
        'Domain, DNS records routing, and hosting server coordination to ensure maximum uptime.',
        'AI conversational chatbot integration for automated visitor query resolution and customer support.',
        'Responsive mobile-first UI development delivering seamless user experience across devices.'
      ],
      technologies: [
        'WordPress', 'PHP', 'JavaScript', 'HTML5', 'CSS3', 'REST APIs',
        'Google Analytics 4', 'Google Search Console', 'SEO', 'SMTP', 'DNS', 'AI Chatbots'
      ],
      achievements: [
        'Significantly enhanced Core Web Vitals and PageSpeed scores across enterprise web portals.',
        'Architected robust analytics and lead capture pipelines improving campaign attribution reliability.'
      ]
    }
  ];

  return (
    <section id="experience" className="py-20 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-2 mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-teal-400 uppercase tracking-widest">
            <Briefcase className="w-3.5 h-3.5" />
            <span>02 // Professional Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Work History & Engineering Contributions
          </h2>
          <p className="text-slate-400 max-w-2xl text-base">
            Demonstrated track record of delivering enterprise web solutions, managing uptime, and implementing telemetry.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          {experiences.map((exp, idx) => (
            <div key={exp.id || idx} className="relative group">
              
              {/* Timeline Node Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-teal-400 group-hover:bg-teal-400 transition-colors shadow-sm shadow-teal-500/50" />

              <div className="rounded-2xl p-6 sm:p-8 bg-[#0d1424] border border-slate-800/90 group-hover:border-slate-700/80 transition-all duration-300 shadow-xl space-y-6">
                
                {/* Header: Position & Company */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-teal-300 transition-colors">
                        {exp.position}
                      </h3>
                      {exp.is_current ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Current Role
                        </span>
                      ) : null}
                    </div>
                    <p className="text-base font-semibold text-sky-400 mt-0.5">
                      {exp.company}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      {exp.start_date} &mdash; {exp.is_current ? 'Present' : exp.end_date}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {exp.location} &bull; {exp.employment_type}
                    </span>
                  </div>
                </div>

                {/* Key Responsibilities */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Core Engineering Responsibilities
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {(exp.responsibilities || []).map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Achievements if present */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                    <h5 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      Key Contributions & Results
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {exp.achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="flex items-center gap-2">
                          <span className="text-amber-400">&bull;</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies Badges */}
                <div className="space-y-2 pt-1 border-t border-slate-800/80">
                  <span className="text-xs font-mono text-slate-400 block">
                    Technologies & Tools Deployed:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(exp.technologies || []).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800/90 text-teal-300 border border-slate-700/80 hover:border-teal-500/40 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
