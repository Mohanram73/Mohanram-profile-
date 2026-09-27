import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, Mail, Shield, Globe, Lock, Save, 
  Loader2, CheckCircle2, AlertCircle, Key 
} from 'lucide-react';

export default function SettingsManager() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Password state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);

  const loadSettings = async () => {
    try {
      const res = await api.getAdminSettings();
      if (res.success && res.settings) {
        setSettings(res.settings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setStatusMessage(null);
    try {
      const res = await api.saveSettings(settings);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'System settings saved successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Failed to save' });
      }
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'Error saving settings' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordStatus({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (res.success) {
        setPasswordStatus({ type: 'success', text: 'Admin password successfully updated!' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordStatus({ type: 'error', text: res.message || 'Failed to change password' });
      }
    } catch (e) {
      setPasswordStatus({ type: 'error', text: 'Server error changing password' });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs font-mono text-slate-400">Loading Configuration...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">System & Notification Settings</h2>
        <p className="text-xs font-mono text-slate-400">Configure email alerts, SMTP relays, SEO tags, and administrator security</p>
      </div>

      {statusMessage && (
        <div className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
          statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Visitor Email Notifications Section */}
        <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-teal-300 font-mono flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-400" />
              <span>Visitor Arrival Email Alerts</span>
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.visitor_notifications_enabled === 'true'}
                onChange={(e) => handleChange('visitor_notifications_enabled', e.target.checked ? 'true' : 'false')}
                className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-0"
              />
              <span className="text-xs font-mono text-white font-semibold">Enable Notifications</span>
            </label>
          </div>

          <p className="text-xs text-slate-400">
            When enabled, an automated summary email is dispatched whenever a new visitor visits your portfolio.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Notification Frequency</label>
              <select
                value={settings.notification_frequency || 'instant'}
                onChange={(e) => handleChange('notification_frequency', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              >
                <option value="instant">Instant Real-time Dispatch</option>
                <option value="daily">Daily Digest Summary</option>
                <option value="weekly">Weekly Analytics Report</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Alert Delivery Email</label>
              <input
                type="email"
                value={settings.admin_notification_email || ''}
                onChange={(e) => handleChange('admin_notification_email', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SMTP Configuration */}
        <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-sky-300 font-mono flex items-center gap-2">
            <Mail className="w-4 h-4 text-sky-400" />
            <span>SMTP Transactional Mail Relay</span>
          </h3>
          <p className="text-xs text-slate-400">
            Relay used to dispatch contact confirmation emails and visitor notifications. If left blank, notifications simulate locally into server logs without interruption.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">SMTP Host</label>
              <input
                type="text"
                placeholder="smtp.gmail.com"
                value={settings.smtp_host || ''}
                onChange={(e) => handleChange('smtp_host', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Port</label>
              <input
                type="text"
                placeholder="587"
                value={settings.smtp_port || ''}
                onChange={(e) => handleChange('smtp_port', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Secure (TLS/SSL)</label>
              <select
                value={settings.smtp_secure || 'false'}
                onChange={(e) => handleChange('smtp_secure', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              >
                <option value="false">STARTTLS (Port 587)</option>
                <option value="true">SSL (Port 465)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">SMTP Username / Email</label>
              <input
                type="text"
                placeholder="your.email@gmail.com"
                value={settings.smtp_user || ''}
                onChange={(e) => handleChange('smtp_user', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">SMTP App Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={settings.smtp_pass || ''}
                onChange={(e) => handleChange('smtp_pass', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SEO & Meta Settings */}
        <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-amber-300 font-mono flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Search Engine Optimization (SEO) & OpenGraph</span>
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Meta Page Title</label>
            <input
              type="text"
              value={settings.seo_meta_title || ''}
              onChange={(e) => handleChange('seo_meta_title', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Meta Description</label>
            <textarea
              rows="2"
              value={settings.seo_meta_description || ''}
              onChange={(e) => handleChange('seo_meta_description', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Keywords (Comma-separated)</label>
              <input
                type="text"
                value={settings.seo_keywords || ''}
                onChange={(e) => handleChange('seo_keywords', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Canonical URL</label>
              <input
                type="url"
                value={settings.seo_canonical_url || ''}
                onChange={(e) => handleChange('seo_canonical_url', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingSettings}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs font-mono bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Configuration</span>
          </button>
        </div>

      </form>

      {/* Admin Password Change Card */}
      <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-rose-300 font-mono flex items-center gap-2">
          <Key className="w-4 h-4 text-rose-400" />
          <span>Security & Admin Password</span>
        </h3>

        {passwordStatus && (
          <div className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
            passwordStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
          }`}>
            {passwordStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{passwordStatus.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">New Password (Min 8 chars)</label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-5 py-2 rounded-xl font-semibold text-xs font-mono bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-2 disabled:opacity-60"
            >
              {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
