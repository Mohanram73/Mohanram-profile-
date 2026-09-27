import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Sparkles, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function HeroEditor() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    api.getContent().then(res => {
      if (res.success && res.data) {
        setHero(res.data.hero);
      }
      setLoading(false);
    });
  }, []);

  const handleChange = (field, value) => {
    setHero(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await api.updateHero(hero);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Hero section saved successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Failed to save' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Connection error while saving' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-mono text-slate-400">Loading Hero Settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Hero Section & Visual Canvas</h2>
        <p className="text-xs font-mono text-slate-400">Configure top hero messaging, action buttons, and background canvas style</p>
      </div>

      {statusMessage && (
        <div className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
          statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 space-y-5 shadow-xl">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Greeting / Pre-title</label>
            <input
              type="text"
              value={hero.greeting || ''}
              onChange={(e) => handleChange('greeting', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Main Headline (Name)</label>
            <input
              type="text"
              required
              value={hero.headline || ''}
              onChange={(e) => handleChange('headline', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300 block">Positioning Subheadline</label>
          <input
            type="text"
            required
            value={hero.subheadline || ''}
            onChange={(e) => handleChange('subheadline', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300 block">Short Professional Statement</label>
          <textarea
            rows="3"
            required
            value={hero.statement || ''}
            onChange={(e) => handleChange('statement', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
          />
        </div>

        {/* CTA Buttons Configuration */}
        <div className="border-t border-slate-800 pt-4 space-y-4">
          <h3 className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
            Call to Action (CTA) Buttons
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">Primary Button Text</label>
              <input
                type="text"
                value={hero.cta_primary_text || ''}
                onChange={(e) => handleChange('cta_primary_text', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">Primary Button Link Anchor</label>
              <input
                type="text"
                value={hero.cta_primary_link || ''}
                onChange={(e) => handleChange('cta_primary_link', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">Secondary Button Text</label>
              <input
                type="text"
                value={hero.cta_secondary_text || ''}
                onChange={(e) => handleChange('cta_secondary_text', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">Secondary Button Link Anchor</label>
              <input
                type="text"
                value={hero.cta_secondary_link || ''}
                onChange={(e) => handleChange('cta_secondary_link', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Background Visual Style */}
        <div className="border-t border-slate-800 pt-4 space-y-4">
          <h3 className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
            Background Canvas Style & Contrast
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block">Interactive Canvas Style</label>
              <select
                value={hero.background_style || 'circuit'}
                onChange={(e) => handleChange('background_style', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              >
                <option value="circuit">Engineering Circuit & Nodes (Hardware ↔ Software)</option>
                <option value="mesh">Geometric Tech Mesh</option>
                <option value="minimalist">Minimalist Dots & Floating Telemetry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Overlay Opacity</span>
                <span className="text-teal-400 font-bold">{hero.overlay_opacity || 85}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={hero.overlay_opacity || 85}
                onChange={(e) => handleChange('overlay_opacity', parseInt(e.target.value, 10))}
                className="w-full accent-teal-500"
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
            <span>Save Hero Configuration</span>
          </button>
        </div>

      </form>
    </div>
  );
}
