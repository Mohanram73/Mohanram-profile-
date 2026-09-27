import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

export default function Login({ onBackToSite }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@mohanram.dev');
  const [password, setPassword] = useState('Admin@123#');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    if (!res.success) {
      setError(res.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b16] flex items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl bg-[#0d1424] border border-slate-800 p-8 shadow-2xl space-y-6">
        
        {/* Back Link */}
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Website</span>
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin CMS Portal</h2>
          <p className="text-xs text-slate-400 font-mono">
            Mohanram R &bull; Content & Telemetry Console
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-xs font-mono bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Console</span>
            )}
          </button>
        </form>

        {/* Demo Credentials Hint */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
          <span className="text-teal-400 font-semibold block">Pre-seeded Credentials:</span>
          <div>Email: <code className="text-slate-200">admin@mohanram.dev</code></div>
          <div>Password: <code className="text-slate-200">Admin@123#</code></div>
        </div>

      </div>
    </div>
  );
}
