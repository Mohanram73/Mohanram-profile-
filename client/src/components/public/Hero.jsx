import React from 'react';
import TechnicalBackground from './TechnicalBackground';
import { useTheme } from '../../context/ThemeContext';
import { 
  ArrowRight, Download, Mail, Github, Linkedin, MapPin, 
  Terminal, ShieldCheck, Cpu, Code2, Database, Layers, Sparkles
} from 'lucide-react';

export default function Hero({ heroData, profileData, onDownloadResume }) {
  const { isDark } = useTheme();

  const headline = heroData?.headline || 'MOHANRAM R';
  const subheadline = heroData?.subheadline || 'Associate Web Developer | Full Stack Developer | Electronics & Embedded Systems';
  const statement = heroData?.statement || 'Building responsive, high-performance digital experiences with modern web technologies, backed by an engineering mindset rooted in Electronics and Embedded Systems.';
  const backgroundStyle = heroData?.background_style || 'circuit';
  const overlayOpacity = heroData?.overlay_opacity || 85;

  const profileImg = profileData?.profile_image || '/uploads/profile-photo.jpg';
  const email = profileData?.email || 'mohitmohanram2001@gmail.com';
  const phone = profileData?.phone || '+91-6382549825';
  const linkedin = profileData?.linkedin || 'https://www.linkedin.com/in/mohanram05';
  const github = profileData?.github || 'https://github.com/Mohanram73';
  const location = profileData?.location || 'Mayiladuthurai, Tamil Nadu, India';

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Interactive Hardware-to-Software Canvas Background */}
      <TechnicalBackground style={backgroundStyle} opacity={overlayOpacity} isDark={isDark} />

      {/* Subtle Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-500/10 via-sky-500/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Column */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            
            {/* Engineering Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-mono text-slate-300 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-semibold text-emerald-400">Available for Opportunities</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-slate-300">Web Development &bull; Full Stack &bull; Embedded Systems</span>
            </div>

            {/* Name Headline */}
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-mono tracking-widest text-teal-400 uppercase font-semibold">
                &lt;Associate Web Developer &amp; Engineer /&gt;
              </p>
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-none">
                {headline}
              </h1>
            </div>

            {/* Positioning Subtitle */}
            <h2 className="text-lg sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-200 to-indigo-200">
              {subheadline}
            </h2>

            {/* Core Professional Statement */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              {statement}
            </p>

            {/* Key Quick Badges: Software + Embedded */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 font-mono text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700/80 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-teal-400" />
                WordPress &bull; React.js &bull; HTML5/CSS3/JS
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700/80 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-sky-400" />
                Core Java &bull; Spring Boot &bull; REST APIs &bull; MySQL
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700/80 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                B.E. ECE &bull; Embedded Systems &bull; Sensors
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/35 transition-all transform hover:-translate-y-0.5 font-mono"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#resume"
                onClick={onDownloadResume}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 shadow-md transition-all transform hover:-translate-y-0.5 font-mono"
              >
                <Download className="w-4 h-4 text-teal-400" />
                <span>Download Resume</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors font-mono"
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Social & Contact Metadata Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{location}</span>
              </div>
              <span className="text-slate-700 hidden sm:inline">&bull;</span>
              <a
                href={`mailto:${email}`}
                className="hover:text-teal-300 transition-colors flex items-center gap-1 font-mono"
              >
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>{email}</span>
              </a>
              <span className="text-slate-700 hidden sm:inline">&bull;</span>
              <div className="flex items-center gap-3">
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-sky-400 transition-colors p-1"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn: /in/mohanram05"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors p-1"
                  aria-label="GitHub Profile"
                  title="GitHub: /Mohanram73"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Profile & Engineering Credential Card */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-72 sm:w-80 group">
              
              {/* Circuit Frame Glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-teal-500/40 via-sky-500/30 to-indigo-500/40 blur-xl opacity-60 group-hover:opacity-100 transition duration-500 -z-10" />

              <div className="rounded-2xl p-4 bg-[#0d1424] border border-slate-700/80 shadow-2xl space-y-4">
                
                {/* Photo container */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                  <img
                    src={profileImg}
                    alt={headline}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/60 flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Verified Engineer
                    </span>
                    <span className="text-slate-300 font-semibold">VDart</span>
                  </div>
                </div>

                {/* Engineering Overview Snapshot */}
                <div className="space-y-2 pt-1 font-mono text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Current / Exp:</span>
                    <span className="font-semibold text-teal-300">Associate Web Developer</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Core Software:</span>
                    <span className="font-semibold text-sky-300">WordPress &bull; React &bull; Java</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Engineering Degree:</span>
                    <span className="font-semibold text-indigo-300">B.E. ECE (7.56 CGPA)</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">National Score:</span>
                    <span className="font-semibold text-emerald-300">TCS NQT 70%</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
