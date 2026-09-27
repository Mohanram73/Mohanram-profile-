import React from 'react';
import { 
  Code2, Cpu, Wrench, Sparkles, CheckCircle2, 
  Terminal, ShieldCheck, Layers, GitBranch, ArrowUpRight, Award, BookOpen, Heart
} from 'lucide-react';

export default function About({ profileData }) {
  const intro = profileData?.bio_intro || 'I am an Associate Web Developer and Software Engineer with an engineering degree in Electronics and Communication from K Ramakrishnan College of Engineering.';
  const engineering = profileData?.bio_engineering || 'With an academic foundation in Electronics & Communication Engineering (CGPA: 7.56), I bring rigorous systems thinking, hardware-software integration knowledge, microcontroller familiarity (Embedded C), and industrial automation concepts (PLC ladder logic) to complex technical challenges.';
  const software = profileData?.bio_software || 'Professionally, I manage enterprise web properties at VDart, delivering custom WordPress frontend solutions, responsive web layouts (HTML5/CSS3/JavaScript), technical SEO and AIEO optimizations, GA4 analytics instrumentation, and AI chatbot integrations using Node.js and the Gemini API.';
  const philosophy = profileData?.bio_philosophy || 'My technical versatility spans React.js, Node.js, Core Java, Spring Boot, RESTful APIs, MySQL, and MongoDB. I focus on clean code, web accessibility standards, cross-browser compatibility, and measurable business impact.';

  const engineeringPillars = [
    {
      icon: Code2,
      color: 'teal',
      title: 'Web Engineering & Enterprise CMS',
      desc: 'WordPress web maintenance, landing page development, forms integration (HubSpot, WPForms), and responsive UI layouts across desktop, tablet, and mobile devices.'
    },
    {
      icon: Cpu,
      color: 'sky',
      title: 'Full Stack & AI Integrations',
      desc: 'Hands-on development with React.js, Node.js, Core Java, Spring Boot, REST APIs, and building AI conversational chatbots powered by Node.js and Google Gemini API.'
    },
    {
      icon: Wrench,
      color: 'amber',
      title: 'SEO, Analytics & Production QA',
      desc: 'Technical SEO, AIEO, Google Analytics, Search Console indexing, UTM campaign attribution, cross-browser DevTools debugging, and domain/DNS/SSL management.'
    },
    {
      icon: Sparkles,
      color: 'indigo',
      title: 'Electronics & Systems Foundation',
      desc: 'B.E. in Electronics & Communication Engineering (CGPA: 7.56 at KRCE), with hands-on microcontroller programming in Embedded C and PLC industrial automation logic.'
    }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-2 mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-teal-400 uppercase tracking-widest">
            <Terminal className="w-3.5 h-3.5" />
            <span>01 // About Me</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineering Precision from Silicon to Full-Stack Web
          </h2>
          <p className="text-slate-400 max-w-2xl text-base">
            Where web engineering, SEO performance, and hardware systems knowledge converge.
          </p>
        </div>

        {/* Two-Column Story & Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Narrative Column */}
          <div className="lg:col-span-7 space-y-5 text-slate-300 text-base leading-relaxed">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
              <p className="text-slate-200 font-medium">
                {intro}
              </p>
              <p className="text-slate-400">
                {software}
              </p>
              <p className="text-slate-400">
                {engineering}
              </p>
              <p className="text-slate-400">
                {philosophy}
              </p>
            </div>

            {/* Target Roles & Interpersonal Strengths */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/30 to-slate-900/60 border border-teal-800/30 space-y-3 shadow-md">
              <h3 className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Target Roles & Capabilities</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                  <span>Associate Web Developer</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  <span>Full Stack Developer (React / Node / Java)</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  <span>WordPress &amp; Web Content Specialist</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Technical SEO &amp; Performance QA</span>
                </div>
              </div>
            </div>

            {/* Languages & Personal Interests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1.5">
                <span className="text-teal-400 font-bold block uppercase tracking-wider">Languages</span>
                <p className="text-slate-300">Tamil (Native), English (Proficient)</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1.5">
                <span className="text-sky-400 font-bold block uppercase tracking-wider">Hobbies & Interests</span>
                <p className="text-slate-300">Playing Cricket, Learning New Technologies</p>
              </div>
            </div>

          </div>

          {/* Pillars Deck Column */}
          <div className="lg:col-span-5 space-y-4">
            {engineeringPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 group shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/70 text-teal-400 group-hover:text-teal-300 group-hover:border-teal-500/40 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
