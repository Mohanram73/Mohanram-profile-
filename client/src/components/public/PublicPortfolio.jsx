import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Skills from './Skills';
import TechEcosystem from './TechEcosystem';
import Projects from './Projects';
import ResumeSection from './ResumeSection';
import EducationSection from './EducationSection';
import ContactSection from './ContactSection';
import Footer from './Footer';
import { api } from '../../services/api';
import { Loader2 } from 'lucide-react';

export default function PublicPortfolio({ onOpenAdmin }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Fetch public content
    api.getContent()
      .then(res => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError('Failed to load portfolio content');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Error connecting to backend server');
      })
      .finally(() => setLoading(false));

    // 2. Track page visit anonymously
    api.trackVisit(window.location.pathname);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center text-teal-400 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin" />
        <span className="font-mono text-xs tracking-widest uppercase text-slate-400">
          Loading Mohanram's Engineering Portfolio...
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center p-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-rose-400 font-mono">Portfolio Offline</h2>
        <p className="text-xs text-slate-400 max-w-md">{error || 'Server error'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-800 text-teal-300 rounded-lg text-xs font-mono border border-slate-700 hover:bg-slate-700"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { profile, hero, experience, skills, projects, education, certifications, presentations, currentResume } = data;

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col selection:bg-teal-500/20 selection:text-teal-300">
      <Navbar onOpenAdmin={onOpenAdmin} />
      
      <main className="flex-1">
        <Hero
          heroData={hero}
          profileData={profile}
          onDownloadResume={() => api.trackEvent('resume_download', 'hero_cta', { version: currentResume?.version })}
        />
        
        <About profileData={profile} />
        
        <Experience experienceList={experience} />
        
        <Skills skillsList={skills} />
        
        <TechEcosystem />
        
        <Projects projectsList={projects} />
        
        <ResumeSection resumeInfo={currentResume} />
        
        <EducationSection
          educationList={education}
          certificationsList={certifications}
          presentationsList={presentations}
        />
        
        <ContactSection profileData={profile} />
      </main>

      <Footer onOpenAdmin={onOpenAdmin} />
    </div>
  );
}
