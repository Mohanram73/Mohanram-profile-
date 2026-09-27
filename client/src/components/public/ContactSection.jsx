import React, { useState } from 'react';
import { 
  Send, Mail, Phone, MapPin, Linkedin, Github, 
  CheckCircle2, AlertCircle, Loader2, Sparkles, Terminal 
} from 'lucide-react';
import { api } from '../../services/api';

export default function ContactSection({ profileData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    opportunity_type: 'Full Stack',
    subject: '',
    message: '',
    website_hp: '' // Honeypot spam defense field
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const email = profileData?.email || 'mohitmohanram2001@gmail.com';
  const phone = profileData?.phone || '+91-6382549825';
  const location = profileData?.location || 'Mayiladuthurai, Tamil Nadu, India';
  const linkedin = profileData?.linkedin || 'https://www.linkedin.com/in/mohanram05';
  const github = profileData?.github || 'https://github.com/Mohanram73';

  const opportunityOptions = [
    'Full Stack Role',
    'Software Engineer',
    'Web Development',
    'Electronics & Embedded',
    'Technical Collaboration',
    'Consulting / Freelance',
    'Other Opportunity'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await api.submitContact(formData);
      if (res.success) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({
          name: '',
          email: '',
          company: '',
          opportunity_type: 'Full Stack',
          subject: '',
          message: '',
          website_hp: ''
        });
      } else {
        setStatus({ loading: false, success: false, error: res.message || 'Failed to submit' });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Connection error. Please try again.' });
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-2 mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-teal-400 uppercase tracking-widest">
            <Send className="w-3.5 h-3.5" />
            <span>08 // Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Initiate Conversation
          </h2>
          <p className="text-slate-400 max-w-2xl text-base">
            Actively open to opportunities with engineering leaders, technical founders, and recruiters. Let's build something exceptional.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Direct Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Direct Contact Channels</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prefer direct communication? Reach out via email or connect with me on LinkedIn. I generally respond within a few hours.
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Email</span>
                    <span className="text-xs font-mono text-white truncate block">{email}</span>
                  </div>
                </a>

                {phone && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Phone / WhatsApp</span>
                      <span className="text-xs font-mono text-white">{phone}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Location</span>
                    <span className="text-xs font-mono text-white">{location}</span>
                  </div>
                </div>
              </div>

              {/* Social Link Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs font-mono transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 text-xs font-mono transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </div>

            </div>

          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-2xl relative">
              
              {status.success ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Message Successfully Sent!</h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. I have received your message and will review it and reply promptly.
                  </p>
                  <button
                    onClick={() => setStatus({ loading: false, success: false, error: null })}
                    className="px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Honeypot Spam Field (Hidden from real users) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website_hp"
                      tabIndex="-1"
                      autoComplete="off"
                      value={formData.website_hp}
                      onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                    />
                  </div>

                  {status.error && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{status.error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300 block">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jane Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300 block">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. jane@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300 block">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Google / Tech Startup"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300 block">
                        Opportunity Type
                      </label>
                      <select
                        value={formData.opportunity_type}
                        onChange={(e) => setFormData({ ...formData, opportunity_type: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                      >
                        {opportunityOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-slate-900 text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 block">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Full Stack Engineering Role / Project Discussion"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 block">
                      Message *
                    </label>
                    <textarea
                      required
                      rows="4"
                      placeholder="Share project details, team context, or role requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-xs font-mono bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {status.loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
