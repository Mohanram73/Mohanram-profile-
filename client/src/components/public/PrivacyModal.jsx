import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

export default function PrivacyModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-[#0c1322] border border-slate-700 p-6 sm:p-8 space-y-5 text-slate-300 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-teal-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-base font-bold text-white font-mono">
              Privacy & Telemetry Policy
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300 max-h-[60vh] overflow-y-auto pr-2">
          <p>
            This website belongs to <strong>Mohanram R</strong>. We respect your digital privacy and adhere to minimal, privacy-conscious telemetry standards.
          </p>
          
          <h4 className="font-bold text-white font-mono text-xs uppercase tracking-wider text-teal-300">
            1. No Personal Data Harvesting
          </h4>
          <p className="text-slate-400">
            We do NOT sell, lease, or distribute visitor information. We do not use third-party invasive advertising cookies or cross-site tracking pixels.
          </p>

          <h4 className="font-bold text-white font-mono text-xs uppercase tracking-wider text-teal-300">
            2. Privacy-Preserving Analytics
          </h4>
          <p className="text-slate-400">
            Our self-hosted analytics engine records aggregate metrics (page visits, general device type, referrer category). IP addresses are cryptographically hashed using SHA-256 with a unique salt &mdash; raw IP addresses are never stored in our database.
          </p>

          <h4 className="font-bold text-white font-mono text-xs uppercase tracking-wider text-teal-300">
            3. Contact Form Submissions
          </h4>
          <p className="text-slate-400">
            When you voluntarily send a message via the contact form, your provided name, email, company, and message are transmitted securely and retained solely for direct professional correspondence.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
