import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Menu, X, Sun, Moon, Shield, ExternalLink, 
  Terminal, Code2, Briefcase, Cpu, Layers, FileText, Send
} from 'lucide-react';

export default function Navbar({ onOpenAdmin }) {
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about', icon: Terminal },
    { name: 'Experience', href: '#experience', icon: Briefcase },
    { name: 'Skills', href: '#skills', icon: Code2 },
    { name: 'Tech Stack', href: '#tech-stack', icon: Cpu },
    { name: 'Projects', href: '#projects', icon: Layers },
    { name: 'Resume', href: '#resume', icon: FileText },
    { name: 'Contact', href: '#contact', icon: Send },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? 'bg-[#0a0f1d]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3'
            : 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Status */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center text-white font-mono font-bold text-lg shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-base sm:text-lg group-hover:text-teal-400 transition-colors">
                  MOHANRAM R
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse-subtle hidden sm:inline-flex">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                  Available
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden md:block">
                Full Stack &bull; Software &bull; Embedded
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions: Theme Toggle, Admin CMS, Contact CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Admin CMS Access Button */}
            <button
              onClick={onOpenAdmin}
              aria-label="Admin CMS"
              className="p-2 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-800/60 transition-colors relative group"
              title="Admin Portal (/admin)"
            >
              <Shield className="w-4 h-4" />
              <span className="absolute -bottom-8 right-0 bg-slate-900 text-slate-200 text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-slate-700">
                Admin CMS
              </span>
            </button>

            {/* Quick Contact CTA */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 hover:shadow-teal-500/30 transition-all font-mono"
            >
              <span>Get in Touch</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800/60"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c1322] border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-400">Navigation</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
              Available for Hire
            </span>
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/80 hover:text-teal-300 transition-colors"
              >
                <Icon className="w-4 h-4 text-teal-400" />
                <span>{link.name}</span>
              </a>
            );
          })}
          <div className="pt-2 flex items-center justify-between gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-slate-300 bg-slate-800/60 border border-slate-700 hover:bg-slate-700"
            >
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              <span>Admin CMS</span>
            </button>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-teal-500 text-slate-950 font-mono"
            >
              <span>Contact Me</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
