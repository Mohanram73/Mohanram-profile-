import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, User, Sparkles, Briefcase, Code2, 
  Layers, GraduationCap, FileText, MessageSquare, Palette, 
  Settings, LogOut, ExternalLink, Shield, Bell, Activity, Menu, X 
} from 'lucide-react';

import AdminDashboard from './AdminDashboard';
import ProfileEditor from './ProfileEditor';
import HeroEditor from './HeroEditor';
import ExperienceEditor from './ExperienceEditor';
import SkillsEditor from './SkillsEditor';
import ProjectsEditor from './ProjectsEditor';
import EducationEditor from './EducationEditor';
import ResumeManager from './ResumeManager';
import MessagesManager from './MessagesManager';
import AppearanceManager from './AppearanceManager';
import SettingsManager from './SettingsManager';

export default function AdminLayout({ onBackToSite }) {
  const { user, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [unreadCount, setUnreadCount] = useState(0);
  const [liveAlert, setLiveAlert] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // SSE Live Visitor Stream
  useEffect(() => {
    const token = localStorage.getItem('mohanram_admin_token');
    if (!token) return;

    // Connect to SSE stream
    const eventSource = new EventSource(`/api/analytics/live-stream?token=${token}`);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'new_visit') {
          setLiveAlert({
            time: new Date().toLocaleTimeString(),
            page: payload.page,
            device: payload.device,
            browser: payload.browser,
            referrer: payload.referrer
          });

          // Auto-dismiss alert banner after 9 seconds
          setTimeout(() => {
            setLiveAlert(null);
          }, 9000);
        }
      } catch (e) {
        console.error('SSE parse error:', e);
      }
    };

    eventSource.onerror = (err) => {
      // EventSource reconnects automatically
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Analytics', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Brand', icon: User },
    { id: 'hero', label: 'Hero & Canvas', icon: Sparkles },
    { id: 'experience', label: 'Experience Timeline', icon: Briefcase },
    { id: 'skills', label: 'Skills Matrix', icon: Code2 },
    { id: 'projects', label: 'Projects & Case Studies', icon: Layers },
    { id: 'education', label: 'Education & Certs', icon: GraduationCap },
    { id: 'resume', label: 'Resume & Downloads', icon: FileText },
    { id: 'messages', label: 'Contact Messages', icon: MessageSquare, badge: unreadCount },
    { id: 'appearance', label: 'Appearance & Themes', icon: Palette },
    { id: 'settings', label: 'System & Security', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="h-16 bg-[#0c1322] border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center font-mono font-bold text-sm">
              M
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">
                MOHANRAM R &bull; CMS
              </span>
              <span className="text-[10px] font-mono text-teal-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Live Telemetry Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Website</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Real-time Live Visitor Notification Banner */}
      {liveAlert && (
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-sky-950 border-b border-teal-500/50 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-white animate-in slide-in-from-top duration-300 shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-teal-300">Live Visitor Detected!</span>
            <span className="text-slate-300">
              Someone is browsing <strong className="text-white">{liveAlert.page}</strong> from {liveAlert.browser} ({liveAlert.device}) via {liveAlert.referrer}.
            </span>
          </div>
          <button onClick={() => setLiveAlert(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside
          className={`w-64 bg-[#0a0f1d] border-r border-slate-800 flex flex-col justify-between shrink-0 fixed md:static inset-y-16 left-0 z-20 transition-transform duration-200 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <nav className="p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Info Card */}
          <div className="p-4 border-t border-slate-800/80 bg-[#0d1424]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-teal-400">
                MR
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-white block truncate">{user?.name || 'Mohanram R'}</span>
                <span className="text-[10px] font-mono text-slate-400 block truncate">{user?.email || 'admin@mohanram.dev'}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
          {currentTab === 'dashboard' && <AdminDashboard liveEvent={liveAlert} />}
          {currentTab === 'profile' && <ProfileEditor />}
          {currentTab === 'hero' && <HeroEditor />}
          {currentTab === 'experience' && <ExperienceEditor />}
          {currentTab === 'skills' && <SkillsEditor />}
          {currentTab === 'projects' && <ProjectsEditor />}
          {currentTab === 'education' && <EducationEditor />}
          {currentTab === 'resume' && <ResumeManager />}
          {currentTab === 'messages' && (
            <MessagesManager onMessageCountChange={(count) => setUnreadCount(count)} />
          )}
          {currentTab === 'appearance' && <AppearanceManager />}
          {currentTab === 'settings' && <SettingsManager />}
        </main>

      </div>

    </div>
  );
}
