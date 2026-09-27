import React, { useState } from 'react';
import { 
  FileText, Download, Eye, CheckCircle2, ShieldCheck, 
  Clock, Calendar, Sparkles, X, ExternalLink 
} from 'lucide-react';
import { api } from '../../services/api';

export default function ResumeSection({ resumeInfo }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const version = resumeInfo?.version || 'v1.2.0';
  const updatedDate = resumeInfo?.uploaded_at
    ? new Date(resumeInfo.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'September 2026';

  const handleDownload = () => {
    // Analytics telemetry
    api.trackEvent('resume_download', 'download_pdf', { version });
    window.location.href = '/api/resume/download';
  };

  const handlePreview = () => {
    api.trackEvent('resume_view', 'preview_modal', { version });
    setIsPreviewOpen(true);
  };

  return (
    <section id="resume" className="py-20 bg-slate-950/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-2 mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-teal-400 uppercase tracking-widest">
            <FileText className="w-3.5 h-3.5" />
            <span>06 // Engineering Resume</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Curriculum Vitae & Verified Credentials
          </h2>
          <p className="text-slate-400 max-w-2xl text-base">
            Comprehensive breakdown of software engineering experience, enterprise projects, technical competencies, and academic background.
          </p>
        </div>

        {/* Resume Card */}
        <div className="rounded-2xl p-8 sm:p-10 bg-[#0d1424] border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Resume Details */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  Software Engineer / Full Stack
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  Version: {version}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  Updated: {updatedDate}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white">
                MOHANRAM R &mdash; Full Stack & Embedded Systems Engineer
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                Ready for recruitment review by CTOs, Engineering Directors, and Technical Leads. Formatted specifically for ATS parsers and technical interviewers, highlighting real VDart experience and project architectures.
              </p>

              {/* Highlights Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Enterprise WordPress & Full Stack</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Core Java & Spring Boot REST APIs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Electronics & Communication Degree</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Clean Code & Production Uptime</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-xs font-mono bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Resume</span>
                </button>

                <button
                  onClick={handlePreview}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-xs font-mono bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <Eye className="w-4 h-4 text-teal-400" />
                  <span>Preview in Browser</span>
                </button>
              </div>

            </div>

            {/* Right Graphic Preview Stamp */}
            <div className="lg:col-span-4 flex justify-center">
              <div 
                onClick={handlePreview}
                className="w-56 h-72 rounded-xl bg-slate-900 border-2 border-dashed border-slate-700 hover:border-teal-500/60 p-4 flex flex-col justify-between items-center text-center cursor-pointer group transition-all"
              >
                <div className="p-3 rounded-full bg-slate-800 text-teal-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-white block">
                    PDF Document
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    Click to Open Fullscreen Preview
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  Instant Viewer
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* PDF In-Browser Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div 
            className="relative w-full max-w-5xl h-[90vh] rounded-2xl bg-[#0c1322] border border-slate-700 flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-mono font-bold text-white">
                  Resume Preview &mdash; {resumeInfo?.original_name || 'Mohanram_R_Resume.pdf'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/api/resume/download"
                  onClick={() => api.trackEvent('resume_download', 'download_pdf_from_preview', { version })}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* IFrame Viewer */}
            <div className="flex-1 w-full bg-slate-900">
              <iframe
                src="/api/resume/preview"
                title="Resume Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
