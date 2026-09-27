import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Layers, Plus, Edit2, Trash2, Save, X, Loader2, Star, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProjectsEditor() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Full Stack',
    summary: '',
    problem: '',
    approach: '',
    architecture: '',
    tech_stack_text: '',
    features_text: '',
    challenges: '',
    solution: '',
    result: '',
    github_url: '',
    live_url: '',
    image_url: '',
    is_featured: 0,
    order_idx: 0
  });
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const categories = ['Full Stack', 'Web', 'Electronics & Embedded', 'Backend', 'Mobile'];

  const loadProjects = async () => {
    try {
      const res = await api.getContent();
      if (res.success && res.data) {
        setProjects(res.data.projects || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleStartAdd = () => {
    setEditingId('new');
    setFormData({
      title: '',
      slug: '',
      category: 'Full Stack',
      summary: '',
      problem: '',
      approach: '',
      architecture: '',
      tech_stack_text: '',
      features_text: '',
      challenges: '',
      solution: '',
      result: '',
      github_url: '',
      live_url: '',
      image_url: '',
      is_featured: 0,
      order_idx: projects.length + 1
    });
  };

  const handleStartEdit = (proj) => {
    setEditingId(proj.id);
    setFormData({
      title: proj.title,
      slug: proj.slug,
      category: proj.category,
      summary: proj.summary,
      problem: proj.problem || '',
      approach: proj.approach || '',
      architecture: proj.architecture || '',
      tech_stack_text: (proj.tech_stack || []).join(', '),
      features_text: (proj.features || []).join('\n'),
      challenges: proj.challenges || '',
      solution: proj.solution || '',
      result: proj.result || '',
      github_url: proj.github_url || '',
      live_url: proj.live_url || '',
      image_url: proj.image_url || '',
      is_featured: proj.is_featured ? 1 : 0,
      order_idx: proj.order_idx || 0
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const payload = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: formData.category,
      summary: formData.summary,
      problem: formData.problem,
      approach: formData.approach,
      architecture: formData.architecture,
      tech_stack: formData.tech_stack_text.split(',').map(s => s.trim()).filter(Boolean),
      features: formData.features_text.split('\n').map(s => s.trim()).filter(Boolean),
      challenges: formData.challenges,
      solution: formData.solution,
      result: formData.result,
      github_url: formData.github_url,
      live_url: formData.live_url,
      image_url: formData.image_url,
      is_featured: formData.is_featured ? 1 : 0,
      order_idx: parseInt(formData.order_idx, 10) || 0
    };

    try {
      let res;
      if (editingId === 'new') {
        res = await api.createProject(payload);
      } else {
        res = await api.updateProject(editingId, payload);
      }

      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Project saved successfully!' });
        setEditingId(null);
        await loadProjects();
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
    if (!window.confirm('Delete this project?')) return;
    try {
      const res = await api.deleteProject(id);
      if (res.success) {
        await loadProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-mono text-slate-400">Loading Projects Repository...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Project Portfolio & Case Studies</h2>
          <p className="text-xs font-mono text-slate-400">Manage case studies, architectural blueprints, and featured projects</p>
        </div>

        {!editingId && (
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors shadow-md shadow-teal-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
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
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#0d1424] border border-teal-500/40 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-teal-300 font-mono">
              {editingId === 'new' ? 'New Project Case Study' : 'Edit Project & Case Study'}
            </h3>
            <button type="button" onClick={() => setEditingId(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Project Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Executive Summary *</label>
            <textarea
              rows="2"
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          {/* Case Study Fields */}
          <div className="border-t border-slate-800 pt-4 space-y-4">
            <h4 className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
              Technical Case Study Breakdown
            </h4>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">1. Problem Solved</label>
              <textarea
                rows="3"
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">2. Engineering Approach</label>
              <textarea
                rows="3"
                value={formData.approach}
                onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">3. System Architecture</label>
              <textarea
                rows="4"
                value={formData.architecture}
                onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono text-[11px]"
                placeholder="Client: React Native&#10;Backend: Node/Express API&#10;Database: MySQL with Geospatial Indexing..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">Technologies Deployed (Comma-separated)</label>
              <input
                type="text"
                placeholder="React Native, TypeScript, Node.js, Express, MySQL"
                value={formData.tech_stack_text}
                onChange={(e) => setFormData({ ...formData, tech_stack_text: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">Platform Features (One per line)</label>
              <textarea
                rows="3"
                value={formData.features_text}
                onChange={(e) => setFormData({ ...formData, features_text: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 block">Technical Hurdles & Challenges</label>
                <textarea
                  rows="3"
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 block">Engineered Solution</label>
                <textarea
                  rows="3"
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">Quantified Result / Impact</label>
              <textarea
                rows="2"
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Links & Attributes */}
          <div className="border-t border-slate-800 pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 block">GitHub Repository URL</label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 block">Live Demo / Product URL</label>
                <input
                  type="url"
                  value={formData.live_url}
                  onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 block">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
              <div className="pt-4 flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured === 1}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
                    className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-0"
                  />
                  <span className="text-xs font-mono text-teal-300 font-semibold">Featured on Public Home</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingId(null)}
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
              <span>Save Project</span>
            </button>
          </div>
        </form>
      )}

      {/* Existing Projects List */}
      <div className="space-y-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-[#0d1424] border border-slate-800 flex items-start justify-between gap-4 shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-white">{proj.title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                  {proj.category}
                </span>
                {proj.is_featured ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Star className="w-3 h-3 fill-amber-300" />
                    Featured
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 max-w-2xl">{proj.summary}</p>
              <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 pt-1">
                <span>Slug: /{proj.slug}</span>
                <span>Views: {proj.views_count || 0}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(proj)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Edit Case Study"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(proj.id)}
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
