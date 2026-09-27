import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Briefcase, Plus, Edit2, Trash2, Save, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ExperienceEditor() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    employment_type: 'Full-time',
    start_date: '',
    end_date: '',
    is_current: 0,
    location: '',
    responsibilities_text: '',
    technologies_text: '',
    achievements_text: '',
    order_idx: 0
  });
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const loadExperiences = async () => {
    try {
      const res = await api.getContent();
      if (res.success && res.data) {
        setExperiences(res.data.experience || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleStartAdd = () => {
    setEditingId('new');
    setFormData({
      company: '',
      position: '',
      employment_type: 'Full-time',
      start_date: '',
      end_date: '',
      is_current: 0,
      location: '',
      responsibilities_text: '',
      technologies_text: '',
      achievements_text: '',
      order_idx: experiences.length + 1
    });
  };

  const handleStartEdit = (exp) => {
    setEditingId(exp.id);
    setFormData({
      company: exp.company,
      position: exp.position,
      employment_type: exp.employment_type,
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current ? 1 : 0,
      location: exp.location,
      responsibilities_text: (exp.responsibilities || []).join('\n'),
      technologies_text: (exp.technologies || []).join(', '),
      achievements_text: (exp.achievements || []).join('\n'),
      order_idx: exp.order_idx || 0
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setStatusMessage(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const payload = {
      company: formData.company,
      position: formData.position,
      employment_type: formData.employment_type,
      start_date: formData.start_date,
      end_date: formData.is_current ? null : formData.end_date,
      is_current: formData.is_current ? 1 : 0,
      location: formData.location,
      responsibilities: formData.responsibilities_text.split('\n').map(s => s.trim()).filter(Boolean),
      technologies: formData.technologies_text.split(',').map(s => s.trim()).filter(Boolean),
      achievements: formData.achievements_text.split('\n').map(s => s.trim()).filter(Boolean),
      order_idx: parseInt(formData.order_idx, 10) || 0
    };

    try {
      let res;
      if (editingId === 'new') {
        res = await api.createExperience(payload);
      } else {
        res = await api.updateExperience(editingId, payload);
      }

      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Experience saved successfully!' });
        setEditingId(null);
        await loadExperiences();
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Save failed' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error connecting to server' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience record?')) return;
    try {
      const res = await api.deleteExperience(id);
      if (res.success) {
        await loadExperiences();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-mono text-slate-400">Loading Experience Records...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Professional Experience Timeline</h2>
          <p className="text-xs font-mono text-slate-400">Manage career history, responsibilities, and verified achievements</p>
        </div>

        {!editingId && (
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors shadow-md shadow-teal-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        )}
      </div>

      {statusMessage && (
        <div className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
          statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Editor Modal / Card */}
      {editingId && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#0d1424] border border-teal-500/40 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-teal-300 font-mono">
              {editingId === 'new' ? 'New Experience Record' : 'Edit Experience'}
            </h3>
            <button type="button" onClick={handleCancel} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Company Name *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Position / Job Title *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Start Date *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2023 or Jan 2023"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">End Date</label>
              <input
                type="text"
                disabled={formData.is_current === 1}
                placeholder="e.g. 2024 or Present"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono disabled:opacity-40"
              />
            </div>
            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={formData.is_current === 1}
                  onChange={(e) => setFormData({ ...formData, is_current: e.target.checked ? 1 : 0 })}
                  className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-0"
                />
                <span className="text-xs font-mono text-slate-300">Current Role</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Location</label>
              <input
                type="text"
                placeholder="e.g. Trichy, India"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Employment Type</label>
              <input
                type="text"
                placeholder="e.g. Full-time / Hybrid"
                value={formData.employment_type}
                onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">
              Core Responsibilities (One per line)
            </label>
            <textarea
              rows="5"
              required
              value={formData.responsibilities_text}
              onChange={(e) => setFormData({ ...formData, responsibilities_text: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              placeholder="WordPress website development...&#10;Technical SEO implementation..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">
              Technologies & Badges (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="WordPress, PHP, JavaScript, HTML5, CSS3, Google Analytics, SEO"
              value={formData.technologies_text}
              onChange={(e) => setFormData({ ...formData, technologies_text: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">
              Achievements / Key Contributions (One per line)
            </label>
            <textarea
              rows="3"
              value={formData.achievements_text}
              onChange={(e) => setFormData({ ...formData, achievements_text: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              placeholder="Enhanced Core Web Vitals from 54 to 92+..."
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl font-semibold text-xs font-mono bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Record</span>
            </button>
          </div>
        </form>
      )}

      {/* List of Existing Experiences */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-2xl bg-[#0d1424] border border-slate-800 flex items-start justify-between gap-4 shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-white">{exp.position}</h3>
                <span className="text-xs font-mono font-semibold text-teal-400">@ {exp.company}</span>
                {exp.is_current ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Current
                  </span>
                ) : null}
              </div>
              <p className="text-xs font-mono text-slate-400">
                {exp.start_date} &mdash; {exp.is_current ? 'Present' : exp.end_date} &bull; {exp.location}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(exp.technologies || []).map((t, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(exp)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-950/40 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
