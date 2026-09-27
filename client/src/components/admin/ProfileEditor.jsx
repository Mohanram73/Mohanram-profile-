import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User, Camera, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfileEditor() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    api.getContent().then(res => {
      if (res.success && res.data) {
        setProfile(res.data.profile);
      }
      setLoading(false);
    });
  }, []);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await api.updateProfile(profile);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Failed to update profile' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Connection error while saving' });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoUploading(true);
    setStatusMessage(null);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await api.uploadPhoto(formData, true);
      if (res.success) {
        setProfile(prev => ({ ...prev, profile_image: res.url }));
        setStatusMessage({ type: 'success', text: 'Profile photo uploaded and saved!' });
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Upload failed' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error uploading photo' });
    } finally {
      setPhotoUploading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-mono text-slate-400">Loading Profile Data...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Profile & Identity</h2>
        <p className="text-xs font-mono text-slate-400">Manage personal branding, bio paragraphs, and social profiles</p>
      </div>

      {statusMessage && (
        <div className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
          statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Photo Upload Section */}
      <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700 shrink-0">
          <img
            src={profile.profile_image || '/uploads/profile-photo.jpg'}
            alt="Profile preview"
            className="w-full h-full object-cover object-top"
          />
          {photoUploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
            </div>
          )}
        </div>

        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-sm font-bold text-white">Profile Photo</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Upload a high-resolution, professional portrait. Supported formats: JPG, PNG, WebP (Max 5MB).
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 cursor-pointer transition-colors">
            <Camera className="w-3.5 h-3.5" />
            <span>{photoUploading ? 'Uploading...' : 'Upload New Photo'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={photoUploading}
            />
          </label>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 space-y-4 shadow-xl">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Full Name</label>
            <input
              type="text"
              required
              value={profile.full_name || ''}
              onChange={(e) => handleChange('full_name', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Location</label>
            <input
              type="text"
              required
              value={profile.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300 block">Professional Title</label>
          <input
            type="text"
            required
            value={profile.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300 block">Tagline / Short Statement</label>
          <textarea
            rows="2"
            required
            value={profile.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
          />
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-4">
          <h3 className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
            Detailed Narrative Paragraphs (About Me Section)
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block">Paragraph 1: Professional Introduction</label>
            <textarea
              rows="3"
              value={profile.bio_intro || ''}
              onChange={(e) => handleChange('bio_intro', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block">Paragraph 2: Software Development Experience</label>
            <textarea
              rows="3"
              value={profile.bio_software || ''}
              onChange={(e) => handleChange('bio_software', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block">Paragraph 3: Electronics & Hardware Roots</label>
            <textarea
              rows="3"
              value={profile.bio_engineering || ''}
              onChange={(e) => handleChange('bio_engineering', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block">Paragraph 4: Engineering Philosophy & Impact</label>
            <textarea
              rows="3"
              value={profile.bio_philosophy || ''}
              onChange={(e) => handleChange('bio_philosophy', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-4">
          <h3 className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
            Contact & Social Profiles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">Email</label>
              <input
                type="email"
                required
                value={profile.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">Phone / Mobile</label>
              <input
                type="text"
                value={profile.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">LinkedIn URL</label>
              <input
                type="url"
                value={profile.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">GitHub URL</label>
              <input
                type="url"
                value={profile.github || ''}
                onChange={(e) => handleChange('github', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs font-mono bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile Changes</span>
          </button>
        </div>

      </form>
    </div>
  );
}
