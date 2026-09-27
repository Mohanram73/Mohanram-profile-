import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  MessageSquare, Mail, Reply, Trash2, CheckCircle2, 
  Archive, Clock, User, Building, Loader2, X, ExternalLink 
} from 'lucide-react';

export default function MessagesManager({ onMessageCountChange }) {
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyNotes, setReplyNotes] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const loadMessages = async () => {
    try {
      const res = await api.getMessages(activeTab);
      if (res.success) {
        setMessages(res.messages || []);
        if (onMessageCountChange) {
          const unread = (res.messages || []).filter(m => m.status === 'unread').length;
          onMessageCountChange(unread);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [activeTab]);

  const handleOpenDetail = (msg) => {
    setSelectedMessage(msg);
    setReplyNotes(msg.reply_notes || '');
    // If unread, automatically mark as read
    if (msg.status === 'unread') {
      api.updateMessageStatus(msg.id, 'read', msg.reply_notes).then(() => {
        loadMessages();
      });
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedMessage) return;
    setSavingStatus(true);
    try {
      await api.updateMessageStatus(selectedMessage.id, status, replyNotes);
      setSelectedMessage(prev => ({ ...prev, status, reply_notes: replyNotes }));
      await loadMessages();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.deleteMessage(id);
      setSelectedMessage(null);
      await loadMessages();
    } catch (e) {
      console.error(e);
    }
  };

  const tabs = ['all', 'unread', 'read', 'replied', 'archived'];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Contact Inbound Inquiries</h2>
        <p className="text-xs font-mono text-slate-400">Review communications, recruiter opportunities, and log response notes</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-colors ${
              activeTab === tab
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="p-8 text-center text-xs font-mono text-slate-400">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0d1424] border border-slate-800 text-slate-400 font-mono text-xs">
          No messages found in '{activeTab}'.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenDetail(msg)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                msg.status === 'unread'
                  ? 'bg-slate-900 border-teal-500/50 hover:border-teal-400'
                  : 'bg-[#0d1424] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1.5 overflow-hidden">
                <div className="flex flex-wrap items-center gap-2">
                  {msg.status === 'unread' && (
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                  )}
                  <h4 className="text-sm font-bold text-white truncate">{msg.subject}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                    {msg.opportunity_type}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    [{msg.status}]
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="text-slate-200">{msg.name}</span>
                  {msg.company && <span>&bull; {msg.company}</span>}
                  <span>&bull; {msg.email}</span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-1">{msg.message}</p>
              </div>

              <div className="text-right shrink-0 text-[11px] font-mono text-slate-500">
                {new Date(msg.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            className="relative w-full max-w-2xl rounded-2xl bg-[#0c1322] border border-slate-700 p-6 sm:p-8 space-y-6 shadow-2xl text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-teal-400 uppercase tracking-wider block">
                  {selectedMessage.opportunity_type}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedMessage.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Sender Name:</span>
                <span className="font-semibold text-white">{selectedMessage.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Work Email:</span>
                <a href={`mailto:${selectedMessage.email}`} className="text-teal-400 hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block">Company:</span>
                <span className="text-white">{selectedMessage.company || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Received:</span>
                <span className="text-slate-300">{new Date(selectedMessage.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase block">Message Body:</label>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            {/* Internal Reply Notes */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase block">Private Reply Notes:</label>
              <textarea
                rows="2"
                placeholder="Log internal notes regarding interview dates, scheduled calls, or offer details..."
                value={replyNotes}
                onChange={(e) => setReplyNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            {/* Actions Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
                <button
                  onClick={() => handleUpdateStatus('replied')}
                  disabled={savingStatus}
                  className="px-3 py-2 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  Mark Replied
                </button>
                <button
                  onClick={() => handleUpdateStatus('archived')}
                  disabled={savingStatus}
                  className="px-3 py-2 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700"
                >
                  Archive
                </button>
              </div>

              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-colors"
                title="Delete Message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
