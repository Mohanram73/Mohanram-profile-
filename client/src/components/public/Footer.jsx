import React, { useState } from 'react';
import { ArrowUp, Shield, Heart, Terminal, Github, Linkedin, Mail } from 'lucide-react';
import PrivacyModal from './PrivacyModal';

export default function Footer({ onOpenAdmin }) {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800 bg-[#070b16] py-12 relative text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand info */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-bold text-white text-base font-mono">MOHANRAM R</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                v1.2.0
              </span>
            </div>
            <p className="text-slate-400 max-w-md">
              Full Stack Developer &bull; Software Engineer &bull; Electronics & Embedded Systems
            </p>
          </div>

          {/* Quick links & Scroll to Top */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-teal-300 transition-colors font-mono underline underline-offset-4"
            >
              Privacy & Analytics
            </button>

            <button
              onClick={onOpenAdmin}
              className="hover:text-teal-300 transition-colors font-mono flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-slate-500 hover:text-teal-400" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Scroll to top"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Mohanram R. All engineering rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Built with React 18 &bull; Tailwind CSS &bull; Node.js</span>
          </div>
        </div>

      </div>

      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
    </footer>
  );
}
