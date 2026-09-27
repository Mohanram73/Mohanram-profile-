import React from 'react';
import { GraduationCap, Award, Calendar, ExternalLink, ShieldCheck, BookOpen, Presentation, Sparkles } from 'lucide-react';

export default function EducationSection({ educationList, certificationsList, presentationsList }) {
  const education = educationList && educationList.length > 0 ? educationList : [
    {
      degree: 'B.E. – Electronics and Communication Engineering',
      institution: 'K Ramakrishnan College of Engineering',
      field_of_study: 'Electronics and Communication Engineering',
      start_year: '2019',
      end_year: '2023',
      grade: 'CGPA: 7.56 (First Class)',
      details: 'Graduated with First Class honors. Comprehensive coursework in Digital Electronics, Microprocessors & Microcontrollers, Analog Circuits, Communication Systems, Digital Signal Processing, and Medical Image Processing.'
    },
    {
      degree: 'Higher Secondary Education',
      institution: 'Best Matriculation Higher Secondary School',
      field_of_study: 'Computer Science & Mathematics',
      start_year: '2017',
      end_year: '2019',
      grade: 'Completed',
      details: 'Sirkazhi, Tamil Nadu. Foundation in Mathematics, Physics, Chemistry, and Computer Science.'
    }
  ];

  const certifications = certificationsList && certificationsList.length > 0 ? certificationsList : [
    { title: 'TCS NQT (National Qualifier Test) — Score: 70%', issuer: 'Tata Consultancy Services', issue_date: '2023' },
    { title: 'Java Full Stack Developer Course', issuer: 'Besant Technologies', issue_date: '11/2023 – 11/2024' },
    { title: 'Embedded Systems Training', issuer: 'National Institute of Electronics & Information Technology (NIELIT)', issue_date: '2023' },
    { title: 'Build a Free Website with WordPress Project', issuer: 'Coursera', issue_date: '2024' },
    { title: 'CSS (Basic) Certificate', issuer: 'HackerRank', issue_date: '2024' },
    { title: 'Computer Vision App (Azure)', issuer: 'Microsoft', issue_date: '2023' }
  ];

  const presentations = presentationsList && presentationsList.length > 0 ? presentationsList : [
    {
      title: 'Blockchain Technology',
      venue: 'K Ramakrishnan College of Engineering (KRCE)',
      type: 'Paper Presentation',
      details: 'Presented technical paper on decentralized architectures, cryptographic security, and distributed consensus.'
    },
    {
      title: 'Biological Amplifiers',
      venue: 'K Ramakrishnan College of Engineering (KRCE)',
      type: 'Paper Presentation',
      details: 'Presented technical research on bio-potential amplification circuits and noise reduction in medical instrumentation.'
    },
    {
      title: 'Machine Learning for Remote Sensing Applications',
      venue: 'National Seminar',
      type: 'Seminar Participation',
      details: 'Participated in national seminar on satellite image classification and ML feature processing.'
    },
    {
      title: 'SUITS IT Program',
      venue: 'Bharathidasan University, Trichy',
      type: 'Co-Curricular IT Program',
      details: 'Participated in university-level IT skill development and computer applications program.'
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-teal-400 uppercase tracking-widest">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>07 // Education & Verified Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Academic Foundation & Industry Certifications
          </h2>
          <p className="text-slate-400 max-w-2xl text-base">
            Engineering degree from Anna University affiliated KRCE with specialized certifications and research presentations.
          </p>
        </div>

        {/* Education & Certifications Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Education Card */}
          <div className="rounded-2xl p-7 bg-[#0d1424] border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Academic Qualifications</h3>
                <span className="text-xs font-mono text-slate-400">Engineering &amp; Higher Secondary</span>
              </div>
            </div>

            <div className="space-y-6">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="space-y-2 pb-4 border-b border-slate-800/60 last:border-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h4 className="text-base font-bold text-teal-300">
                      {edu.degree}
                    </h4>
                    <span className="flex items-center gap-1 text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 w-fit">
                      <Calendar className="w-3 h-3 text-teal-400" />
                      {edu.start_year} &mdash; {edu.end_year}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {edu.institution}
                  </p>

                  {edu.grade && (
                    <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {edu.grade}
                    </span>
                  )}

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {edu.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Card */}
          <div className="rounded-2xl p-7 bg-[#0d1424] border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Verified Certifications & Scores</h3>
                <span className="text-xs font-mono text-slate-400">Industry &amp; Technology Recognized</span>
              </div>
            </div>

            <div className="space-y-3">
              {certifications.map((cert, idx) => (
                <div
                  key={cert.id || idx}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <h5 className="text-xs sm:text-sm font-semibold text-white">
                      {cert.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span className="text-sky-300">{cert.issuer}</span>
                      {cert.issue_date && (
                        <>
                          <span>&bull;</span>
                          <span>{cert.issue_date}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {cert.credential_url ? (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-800 transition-colors shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="p-1.5 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Paper Presentations & Co-Curricular Banner */}
        <div className="rounded-2xl p-7 bg-[#0d1424] border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Presentation className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Paper Presentations &amp; Co-Curricular Programs</h3>
              <span className="text-xs font-mono text-slate-400">Technical Research &amp; University Programs</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presentations.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {item.type}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{item.venue}</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.details}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
