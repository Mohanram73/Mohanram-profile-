import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { GraduationCap, Award, Plus, Edit2, Trash2, Save, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EducationEditor() {
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  // Modal / form states for Education
  const [editingEdu, setEditingEdu] = useState(null);
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', field_of_study: '', start_year: '', end_year: '', grade: '', details: '', order_idx: 0 });

  // Modal / form states for Certification
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState({ title: '', issuer: '', issue_date: '', credential_url: '', credential_id: '', order_idx: 0 });

  const loadData = async () => {
    try {
      const res = await api.getContent();
      if (res.success && res.data) {
        setEducation(res.data.education || []);
        setCertifications(res.data.certifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveEdu = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingEdu === 'new') {
        res = await api.createEducation(eduForm);
      } else {
        res = await api.updateEducation(editingEdu, eduForm);
      }
      if (res.success) {
        setEditingEdu(null);
        await loadData();
        setStatusMessage({ type: 'success', text: 'Education saved!' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error saving education' });
    }
  };

  const handleDeleteEdu = async (id) => {
    if (!window.confirm('Delete education record?')) return;
    await api.deleteEducation(id);
    await loadData();
  };

  const handleSaveCert = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingCert === 'new') {
        res = await api.createCertification(certForm);
      } else {
        res = await api.updateCertification(editingCert, certForm);
      }
      if (res.success) {
        setEditingCert(null);
        await loadData();
        setStatusMessage({ type: 'success', text: 'Certification saved!' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error saving certification' });
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Delete certification record?')) return;
    await api.deleteCertification(id);
    await loadData();
  };

  if (loading) return <div className="p-8 text-center text-xs font-mono text-slate-400">Loading Credentials...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Education & Certifications</h2>
        <p className="text-xs font-mono text-slate-400">Manage academic degrees and professional certifications</p>
      </div>

      {statusMessage && (
        <div className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
          statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Education Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-teal-300 font-mono flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-400" />
            <span>Academic Degrees</span>
          </h3>
          {!editingEdu && (
            <button
              onClick={() => {
                setEditingEdu('new');
                setEduForm({ degree: '', institution: '', field_of_study: '', start_year: '', end_year: '', grade: '', details: '', order_idx: education.length + 1 });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 text-teal-300 border border-slate-700 hover:bg-slate-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Degree</span>
            </button>
          )}
        </div>

        {editingEdu && (
          <form onSubmit={handleSaveEdu} className="p-5 rounded-2xl bg-[#0d1424] border border-teal-500/40 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Degree (e.g. B.E.)"
                required
                value={eduForm.degree}
                onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              />
              <input
                type="text"
                placeholder="Field of Study (e.g. Electronics & Communication)"
                required
                value={eduForm.field_of_study}
                onChange={(e) => setEduForm({ ...eduForm, field_of_study: e.target.value })}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Institution / University"
                required
                value={eduForm.institution}
                onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              />
              <input
                type="text"
                placeholder="Start Year"
                value={eduForm.start_year}
                onChange={(e) => setEduForm({ ...eduForm, start_year: e.target.value })}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              />
              <input
                type="text"
                placeholder="End Year / Graduated"
                value={eduForm.end_year}
                onChange={(e) => setEduForm({ ...eduForm, end_year: e.target.value })}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              />
            </div>
            <textarea
              rows="3"
              placeholder="Coursework details, honors, capstone project..."
              value={eduForm.details}
              onChange={(e) => setEduForm({ ...eduForm, details: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingEdu(null)} className="px-3 py-1.5 text-xs font-mono text-slate-400">Cancel</button>
              <button type="submit" className="px-4 py-1.5 rounded-xl text-xs font-mono bg-teal-500 text-slate-950 font-bold">Save Degree</button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="p-4 rounded-xl bg-[#0d1424] border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">{edu.degree} in {edu.field_of_study}</h4>
                <p className="text-xs text-slate-400">{edu.institution} &bull; {edu.start_year} - {edu.end_year}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingEdu(edu.id);
                    setEduForm({ ...edu });
                  }}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteEdu(edu.id)} className="p-1.5 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-sky-300 font-mono flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-400" />
            <span>Professional Certifications</span>
          </h3>
          {!editingCert && (
            <button
              onClick={() => {
                setEditingCert('new');
                setCertForm({ title: '', issuer: '', issue_date: '', credential_url: '', credential_id: '', order_idx: certifications.length + 1 });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 text-sky-300 border border-slate-700 hover:bg-slate-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certification</span>
            </button>
          )}
        </div>

        {editingCert && (
          <form onSubmit={handleSaveCert} className="p-5 rounded-2xl bg-[#0d1424] border border-sky-500/40 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Certification Title *"
                required
                value={certForm.title}
                onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              />
              <input
                type="text"
                placeholder="Issuer (e.g. Google Skillshop, AWS)"
                required
                value={certForm.issuer}
                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Issue Date / Year"
                value={certForm.issue_date}
                onChange={(e) => setCertForm({ ...certForm, issue_date: e.target.value })}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              />
              <input
                type="url"
                placeholder="Credential Verification URL"
                value={certForm.credential_url}
                onChange={(e) => setCertForm({ ...certForm, credential_url: e.target.value })}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingCert(null)} className="px-3 py-1.5 text-xs font-mono text-slate-400">Cancel</button>
              <button type="submit" className="px-4 py-1.5 rounded-xl text-xs font-mono bg-sky-500 text-slate-950 font-bold">Save Certification</button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="p-4 rounded-xl bg-[#0d1424] border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                <p className="text-xs text-slate-400">{cert.issuer} &bull; {cert.issue_date}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingCert(cert.id);
                    setCertForm({ ...cert });
                  }}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteCert(cert.id)} className="p-1.5 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
