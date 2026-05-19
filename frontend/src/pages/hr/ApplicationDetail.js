// src/pages/hr/ApplicationDetail.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import StatusBadge from '../../components/common/StatusBadge';

const STATUSES = ['Submitted','Under Review','Shortlisted','Interview Scheduled','Rejected','Selected'];

export default function ApplicationDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [app,       setApp]       = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [status,    setStatus]    = useState('');
  const [hrNotes,   setHrNotes]   = useState('');
  const [emailSub,  setEmailSub]  = useState('');
  const [emailMsg,  setEmailMsg]  = useState('');
  const [saving,    setSaving]    = useState(false);
  const [emailing,  setEmailing]  = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    api.get(`/applications/${id}`)
      .then(r => {
        setApp(r.data.application);
        setStatus(r.data.application.status);
        setHrNotes(r.data.application.hrNotes || '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async () => {
    setSaving(true);
    try {
      await api.put(`/applications/${id}/status`, { status, hrNotes });
      toast.success('Status updated and email sent to candidate');
      setApp(prev => ({ ...prev, status, hrNotes }));
    } catch { toast.error('Failed to update status'); }
    finally { setSaving(false); }
  };

  const handleSendEmail = async () => {
    if (!emailSub || !emailMsg) { toast.error('Subject and message required'); return; }
    setEmailing(true);
    try {
      await api.post(`/applications/${id}/email`, { subject: emailSub, message: emailMsg });
      toast.success('Email sent!');
      setEmailSub(''); setEmailMsg(''); setShowEmail(false);
    } catch { toast.error('Failed to send email'); }
    finally { setEmailing(false); }
  };

  if (loading) return <div className="page-wrapper"><div className="spinner" /></div>;
  if (!app)    return <div className="page-wrapper"><div className="container"><p>Not found.</p></div></div>;

  const c = app.candidate;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth:'900px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
          <h1 className="page-title">Application Detail</h1>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>← Back</button>
        </div>

        <div className="grid-2">
          {/* Candidate Info */}
          <div className="card">
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px' }}>
              <img src={c?.profilePicUrl || `https://ui-avatars.com/api/?name=${c?.name}&background=2563eb&color=fff`}
                alt="" style={{ width:'60px', height:'60px', borderRadius:'50%', objectFit:'cover' }} />
              <div>
                <h3>{c?.name}</h3>
                <p style={{ fontSize:'13px', color:'#6b7280' }}>{c?.email}</p>
                {c?.phone && <p style={{ fontSize:'13px', color:'#6b7280' }}>{c?.phone}</p>}
              </div>
            </div>

            {c?.skills?.length > 0 && (
              <div style={{ marginBottom:'12px' }}>
                <strong style={{ fontSize:'13px' }}>Skills:</strong>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginTop:'6px' }}>
                  {c.skills.map(s => (
                    <span key={s} style={{ background:'#dbeafe', color:'#1d4ed8',
                      padding:'2px 10px', borderRadius:'12px', fontSize:'12px' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {c?.education?.degree && (
              <p style={{ fontSize:'13px', color:'#374151', marginBottom:'6px' }}>
                🎓 {c.education.degree} — {c.education.institution} ({c.education.year})
              </p>
            )}
            {c?.experience?.years > 0 && (
              <p style={{ fontSize:'13px', color:'#374151', marginBottom:'6px' }}>
                💼 {c.experience.years} year(s) experience: {c.experience.summary}
              </p>
            )}
            {c?.linkedIn && <a href={c.linkedIn} target="_blank" rel="noreferrer"
              style={{ fontSize:'13px', color:'#2563eb', display:'block' }}>🔗 LinkedIn</a>}
            {c?.portfolio && <a href={c.portfolio} target="_blank" rel="noreferrer"
              style={{ fontSize:'13px', color:'#2563eb', display:'block' }}>🌐 Portfolio</a>}
          </div>

          {/* Job & Files */}
          <div>
            <div className="card">
              <h3 style={{ marginBottom:'12px' }}>Job Applied For</h3>
              <p style={{ fontWeight:'600' }}>{app.job?.title}</p>
              <p style={{ fontSize:'13px', color:'#6b7280' }}>
                {app.job?.department} · {app.job?.branch?.name}
              </p>
              <p style={{ fontSize:'13px', color:'#6b7280', marginTop:'4px' }}>
                Applied: {new Date(app.createdAt).toLocaleDateString()}
              </p>
              <div style={{ marginTop:'12px', display:'flex', gap:'10px' }}>
                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                  📄 Resume
                </a>
                {app.coverLetterUrl && (
                  <a href={app.coverLetterUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                    📝 Cover Letter
                  </a>
                )}
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom:'12px' }}>Current Status</h3>
              <StatusBadge status={app.status} />
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="card">
          <h3 style={{ marginBottom:'16px' }}>Update Application Status</h3>
          <div className="grid-2">
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>HR Notes (internal)</label>
              <input value={hrNotes} onChange={e => setHrNotes(e.target.value)}
                placeholder="Internal notes..." />
            </div>
          </div>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            <button className="btn btn-primary" onClick={handleStatusUpdate} disabled={saving}>
              {saving ? 'Saving...' : 'Update Status'}
            </button>
            {status === 'Shortlisted' && (
              <Link to={`/hr/interviews/schedule/${app._id}`} className="btn btn-success">
                📅 Schedule Interview
              </Link>
            )}
            <button className="btn btn-secondary" onClick={() => setShowEmail(!showEmail)}>
              ✉️ Send Custom Email
            </button>
          </div>
        </div>

        {/* Custom Email */}
        {showEmail && (
          <div className="card">
            <h3 style={{ marginBottom:'16px' }}>Send Email to {c?.name}</h3>
            <div className="form-group">
              <label>Subject</label>
              <input value={emailSub} onChange={e => setEmailSub(e.target.value)} placeholder="Email subject" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea value={emailMsg} onChange={e => setEmailMsg(e.target.value)}
                rows={4} placeholder="Your message..." />
            </div>
            <button className="btn btn-primary" onClick={handleSendEmail} disabled={emailing}>
              {emailing ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
