import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { Palette, Sun, Moon, Sparkles, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AppearanceManager() {
  const { isDark, toggleTheme, accentColor, setAccentColor, primaryColor, setPrimaryColor } = useTheme();
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const presetAccents = [
    { name: 'Teal (Default)', hex: '#14b8a6' },
    { name: 'Sky Blue', hex: '#0ea5e9' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Electric Indigo', hex: '#6366f1' },
    { name: 'Amber Glow', hex: '#f59e0b' },
    { name: 'Rose', hex: '#f43f5e' }
  ];

  const handleSavePreferences = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await api.saveSettings({
        theme_mode: isDark ? 'dark' : 'light',
        accent_color: accentColor,
        primary_color: primaryColor
      });
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Appearance settings saved and applied!' });
      }
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'Failed to persist settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Website Appearance & Theme</h2>
        <p className="text-xs font-mono text-slate-400">Configure theme modes, brand accent palettes, and styling</p>
      </div>

      {statusMessage && (
        <div className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
          statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Theme Mode Card */}
      <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Palette className="w-4 h-4 text-teal-400" />
          <span>Active Interface Theme</span>
        </h3>
        <p className="text-xs text-slate-400">
          Toggle between dark engineering mode and high-contrast light mode.
        </p>

        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={() => isDark || toggleTheme()}
            className={`flex-1 p-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${
              isDark ? 'bg-slate-900 border-teal-500/80 text-white font-bold' : 'bg-slate-900/40 border-slate-800 text-slate-400'
            }`}
          >
            <Moon className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-mono">Dark Engineering Theme</span>
          </button>

          <button
            onClick={() => !isDark || toggleTheme()}
            className={`flex-1 p-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${
              !isDark ? 'bg-slate-900 border-teal-500/80 text-white font-bold' : 'bg-slate-900/40 border-slate-800 text-slate-400'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono">Clean Light Theme</span>
          </button>
        </div>
      </div>

      {/* Brand Accent Color Customizer */}
      <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Brand Accent Color Palette</span>
        </h3>
        <p className="text-xs text-slate-400">
          Controls highlight buttons, focus rings, tech node pulses, and interactive glows across the website.
        </p>

        {/* Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {presetAccents.map((preset) => (
            <button
              key={preset.hex}
              onClick={() => setAccentColor(preset.hex)}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                accentColor === preset.hex
                  ? 'bg-slate-900 border-white text-white font-bold shadow-md'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span
                className="w-5 h-5 rounded-full shrink-0 border border-white/20"
                style={{ backgroundColor: preset.hex }}
              />
              <span className="text-xs font-mono">{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Custom Hex Input */}
        <div className="pt-3 border-t border-slate-800 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Custom Color:</span>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
            />
          </div>
          <span className="text-xs font-mono text-teal-300 font-bold">{accentColor}</span>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl font-semibold text-xs font-mono bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 transition-all flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Appearance Settings</span>
        </button>
      </div>

    </div>
  );
}
