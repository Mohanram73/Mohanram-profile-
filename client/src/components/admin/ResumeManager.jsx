import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FileText, Upload, Download, Clock, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ResumeManager() {
  const [history, setHistory] = useState([]);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [versionTag, setVersionTag] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  const loadResumeHistory = async () => {
    try {
      const res = await api.getResumeHistory();
      if (res.success) {
        setHistory(res.history || []);
        setTotalDownloads(res.totalDownloads || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumeHistory();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setStatusMessage({ type: 'error', text: 'Only PDF documents are accepted.' });
      return;
    }

    setUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('version', versionTag || `v${new Date().toISOString().slice(2, 10).replace(/-/g, '.')}`);

    try {
      const res = await api.uploadResume(formData);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'New resume successfully uploaded and set as active!' });
        setVersionTag('');
        await loadResumeHistory();
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Upload failed' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error uploading resume' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs font-mono text-slate-400">Loading Resume Versions...</div>;

  const currentResume = history.find(r => r.is_current === 1) || history[0];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Resume Management & Version Control</h2>
        <p className="text-xs font-mono text-slate-400">Upload and deploy latest resume PDFs, track version history and recruiter downloads</p>
      </div>

      {statusMessage && (
        <div className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
          statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Active Resume Card */}
      <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-sm font-bold text-white font-mono">Active Production Resume</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            {totalDownloads} Total Downloads Logged
          </span>
        </div>

        {currentResume ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-bold text-white">{currentResume.original_name}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  {currentResume.version}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Uploaded: {new Date(currentResume.uploaded_at).toLocaleString()} &bull; Size: {(currentResume.file_size / 1024).toFixed(1)} KB
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/api/resume/download"
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Active PDF</span>
              </a>
              <a
                href="/api/resume/preview"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                Preview
              </a>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-mono">No resume active yet</p>
        )}
      </div>

      {/* Upload New Version */}
      <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-teal-300 font-mono flex items-center gap-2">
          <Upload className="w-4 h-4 text-teal-400" />
          <span>Deploy New Resume PDF</span>
        </h3>
        <p className="text-xs text-slate-400">
          Uploading replaces the live download link on the public website immediately while archiving previous versions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Version Tag (Optional)</label>
            <input
              type="text"
              placeholder="e.g. v1.3.0 or September-2026"
              value={versionTag}
              onChange={(e) => setVersionTag(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div className="pt-5">
            <label className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 cursor-pointer transition-colors">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{uploading ? 'Processing & Deploying...' : 'Select PDF & Deploy'}</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                disabled={uploading}
                onChange={handleUpload}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Version History Archive */}
      <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Resume Version History Archive</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2">Version</th>
                <th className="py-2">File Name</th>
                <th className="py-2">Upload Date</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {history.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-900/50">
                  <td className="py-2.5 font-bold text-teal-300">{rev.version}</td>
                  <td className="py-2.5 text-slate-300">{rev.original_name}</td>
                  <td className="py-2.5 text-slate-400">{new Date(rev.uploaded_at).toLocaleDateString()}</td>
                  <td className="py-2.5">
                    {rev.is_current ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-500">
                        Archived
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
