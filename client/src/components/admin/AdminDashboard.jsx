import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  Users, Eye, Download, MessageSquare, TrendingUp, 
  Monitor, Smartphone, Tablet, Globe, Clock, RefreshCw, Loader2, Sparkles, Activity
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminDashboard({ liveEvent }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const res = await api.getAnalyticsDashboard();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // When a live event arrives via SSE, auto-refresh stats or append
  useEffect(() => {
    if (liveEvent && liveEvent.type === 'new_visit') {
      loadData();
    }
  }, [liveEvent]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-teal-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="font-mono text-xs text-slate-400">Loading Analytics Intelligence...</span>
      </div>
    );
  }

  const stats = data?.stats || {};
  const topPages = data?.topPages || [];
  const devices = data?.devices || [];
  const sources = data?.sources || [];
  const browsers = data?.browsers || [];
  const dailyTrend = data?.dailyTrend || [];
  const recentVisits = data?.recentVisits || [];

  const COLORS = ['#14b8a6', '#0ea5e9', '#6366f1', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header and Refresh Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Analytics & Telemetry Overview
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Privacy-preserving metrics &bull; No cookies &bull; Salted SHA-256 IP hashes
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-teal-400' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Visits</span>
            <Eye className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats.totalVisits || 0}
          </p>
          <span className="text-[11px] font-mono text-slate-400 block">
            Today: <span className="text-teal-300 font-bold">+{stats.todayVisits || 0}</span>
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Unique Visitors</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats.uniqueVisitors || 0}
          </p>
          <span className="text-[11px] font-mono text-slate-400 block">
            New: <span className="text-sky-300">{stats.newCount || 0}</span> &bull; Returning: <span className="text-indigo-300">{stats.returningCount || 0}</span>
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Resume Downloads</span>
            <Download className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats.resumeDownloads || 0}
          </p>
          <span className="text-[11px] font-mono text-emerald-400 block">
            Direct recruiter actions
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Contact Messages</span>
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats.totalMessages || 0}
          </p>
          <span className="text-[11px] font-mono text-slate-400 block">
            Unread: <span className="text-amber-400 font-bold">{stats.unreadMessages || 0}</span>
          </span>
        </div>
      </div>

      {/* Trend Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Visits Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Visitor Trajectory (Last 14 Days)</h3>
              <p className="text-[11px] font-mono text-slate-400">Total Visits vs Unique IP Sessions</p>
            </div>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>

          <div className="h-64 w-full">
            {dailyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTrend}>
                  <defs>
                    <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} fontStyle="mono" />
                  <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} fontStyle="mono" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="visits" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#visitGrad)" name="Total Visits" />
                  <Area type="monotone" dataKey="unique_visits" stroke="#0ea5e9" strokeWidth={2} fill="none" name="Unique Visitors" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">
                Data accumulating as new visitors arrive...
              </div>
            )}
          </div>
        </div>

        {/* Device Breakdown Pie */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Device Breakdown</h3>
              <p className="text-[11px] font-mono text-slate-400">Desktop vs Mobile vs Tablet</p>
            </div>
            <Monitor className="w-4 h-4 text-sky-400" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {devices.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={devices}
                    dataKey="count"
                    nameKey="device"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {devices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs font-mono text-slate-500">No device data yet</div>
            )}
          </div>
        </div>

      </div>

      {/* Traffic Sources & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Traffic Sources */}
        <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white">Inbound Traffic Channels</h3>
            <Globe className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="space-y-3">
            {sources.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">{s.referrer}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-teal-300">{s.count} visits</span>
                </div>
              </div>
            ))}
            {sources.length === 0 && (
              <div className="text-xs font-mono text-slate-500 text-center py-4">No referrers logged yet</div>
            )}
          </div>
        </div>

        {/* Top Pages */}
        <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white">Most Viewed Pages</h3>
            <Eye className="w-4 h-4 text-teal-400" />
          </div>
          <div className="space-y-3">
            {topPages.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 truncate max-w-xs">{p.page}</span>
                <span className="font-bold text-sky-400">{p.views} views</span>
              </div>
            ))}
            {topPages.length === 0 && (
              <div className="text-xs font-mono text-slate-500 text-center py-4">No page views recorded yet</div>
            )}
          </div>
        </div>

      </div>

      {/* Recent Visits Activity Feed */}
      <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Recent Anonymous Visitor Activity</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Live Telemetry Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2">Time</th>
                <th className="py-2">Page</th>
                <th className="py-2">Referrer</th>
                <th className="py-2">Device</th>
                <th className="py-2">Browser / OS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {recentVisits.map((visit) => (
                <tr key={visit.id} className="hover:bg-slate-900/50">
                  <td className="py-2.5 text-slate-400">
                    {new Date(visit.created_at).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 text-teal-300 font-semibold">{visit.page}</td>
                  <td className="py-2.5">{visit.referrer}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                      {visit.device}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-400">{visit.browser} on {visit.os}</td>
                </tr>
              ))}
              {recentVisits.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-slate-500">
                    No recent visits logged yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
