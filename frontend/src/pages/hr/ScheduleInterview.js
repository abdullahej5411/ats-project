// src/pages/hr/ScheduleInterview.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function ScheduleInterview() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [app,     setApp]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    scheduledDate:'', scheduledTime:'', type:'Video Call',
    location:'', messageToCandidate:''
  });

  useEffect(() => {
    api.get(`/applications/${applicationId}`)
      .then(r => setApp(r.data.application));
  }, [applicationId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/interviews', { applicationId, ...form });
      toast.success('Interview scheduled and email sent to candidate!');
      navigate('/hr/interviews');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth:'600px' }}>
        <h1 className="page-title">Schedule Interview</h1>

        {app && (
          <div className="card" style={{ background:'#f0f9ff', marginBottom:'20px' }}>
            <h3>{app.candidate?.name}</h3>
            <p style={{ fontSize:'13px', color:'#6b7280' }}>{app.candidate?.email}</p>
            <p style={{ fontSize:'13px', color:'#6b7280', marginTop:'4px' }}>
              Applying for: <strong>{app.job?.title}</strong> — {app.job?.branch?.name}
            </p>
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Interview Date *</label>
                <input type="date" name="scheduledDate" value={form.scheduledDate}
                  onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Interview Time *</label>
                <input type="time" name="scheduledTime" value={form.scheduledTime}
                  onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Interview Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option>Video Call</option>
                <option>In-Person</option>
                <option>Phone</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location / Meeting Link</label>
              <input name="location" value={form.location} onChange={handleChange}
                placeholder="Zoom link or office address" />
            </div>

            <div className="form-group">
              <label>Message to Candidate</label>
              <textarea name="messageToCandidate" value={form.messageToCandidate}
                onChange={handleChange} rows={3}
                placeholder="Any special instructions or notes for the candidate..." />
            </div>

            <div style={{ display:'flex', gap:'12px' }}>
              <button type="button" className="btn btn-secondary"
                onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Scheduling...' : '📅 Schedule & Send Email'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
