import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Code2, Plus, Edit2, Trash2, Save, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SkillsEditor() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    proficiency_level: 'Professional',
    icon: 'Code',
    order_idx: 0
  });
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const categories = [
    'Frontend',
    'Backend',
    'Database',
    'CMS / Web Platforms',
    'Tools',
    'Testing',
    'Web / Marketing Technology',
    'Electronics & Embedded'
  ];

  const levels = ['Professional', 'Strong', 'Working Knowledge', 'Fundamental'];

  const loadSkills = async () => {
    try {
      const res = await api.getContent();
      if (res.success && res.data) {
        setSkills(res.data.skills || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleStartAdd = () => {
    setEditingId('new');
    setFormData({
      name: '',
      category: 'Frontend',
      proficiency_level: 'Professional',
      icon: 'Code',
      order_idx: skills.length + 1
    });
  };

  const handleStartEdit = (skill) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency_level: skill.proficiency_level,
      icon: skill.icon || 'Code',
      order_idx: skill.order_idx || 0
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      let res;
      if (editingId === 'new') {
        res = await api.createSkill(formData);
      } else {
        res = await api.updateSkill(editingId, formData);
      }

      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Skill saved successfully!' });
        setEditingId(null);
        await loadSkills();
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
    if (!window.confirm('Delete this skill?')) return;
    try {
      const res = await api.deleteSkill(id);
      if (res.success) {
        await loadSkills();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-mono text-slate-400">Loading Skills Matrix...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Skills & Technology Matrix</h2>
          <p className="text-xs font-mono text-slate-400">Manage technical stack categories and qualitative proficiency levels</p>
        </div>

        {!editingId && (
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors shadow-md shadow-teal-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
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
              {editingId === 'new' ? 'New Skill Entry' : 'Edit Skill'}
            </h3>
            <button type="button" onClick={() => setEditingId(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Skill / Technology Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. React.js, Spring Boot, Microcontrollers"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Qualitative Proficiency Level *</label>
              <select
                value={formData.proficiency_level}
                onChange={(e) => setFormData({ ...formData, proficiency_level: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Display Order</label>
              <input
                type="number"
                value={formData.order_idx}
                onChange={(e) => setFormData({ ...formData, order_idx: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
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
              <span>Save Skill</span>
            </button>
          </div>
        </form>
      )}

      {/* Grouped Skills List */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const group = skills.filter((s) => s.category === cat);
          if (group.length === 0) return null;
          return (
            <div key={cat} className="p-5 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-md space-y-3">
              <h3 className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
                {cat} ({group.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {group.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-white">{skill.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{skill.proficiency_level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(skill)}
                        className="p-1 rounded text-slate-400 hover:text-white"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="p-1 rounded text-rose-400 hover:text-rose-300"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
