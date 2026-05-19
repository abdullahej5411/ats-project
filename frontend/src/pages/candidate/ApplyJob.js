// src/pages/candidate/ApplyJob.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function ApplyJob() {
  const { jobId }  = useParams();
  const navigate   = useNavigate();
  const [job, setJob]         = useState(null);
  const [resume, setResume]   = useState(null);
  const [cover, setCover]     = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${jobId}`).then(r => setJob(r.data.job));
  }, [jobId]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!resume) { toast.error('Resume is required'); return; }

    const formData = new FormData();
    formData.append('jobId',   jobId);
    formData.append('resume',  resume);
    if (cover) formData.append('coverLetter', cover);

    setLoading(true);
    try {
      await api.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Application submitted successfully!');
      navigate('/candidate/applications');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth:'600px' }}>
        <h1 className="page-title">Apply for Position</h1>
        {job && (
          <div className="card" style={{ background:'#f0f9ff', marginBottom:'20px' }}>
            <h3>{job.title}</h3>
            <p style={{ color:'#6b7280', fontSize:'14px' }}>
              {job.branch?.name} · {job.department} · {job.type}
            </p>
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Resume (PDF/DOC) *</label>
              <input type="file" accept=".pdf,.doc,.docx"
                onChange={e => setResume(e.target.files[0])} required />
              <small style={{ color:'#9ca3af', fontSize:'12px' }}>
                Accepted formats: PDF, DOC, DOCX
              </small>
            </div>

            <div className="form-group">
              <label>Cover Letter (Optional)</label>
              <input type="file" accept=".pdf,.doc,.docx"
                onChange={e => setCover(e.target.files[0])} />
            </div>

            <div style={{ display:'flex', gap:'12px' }}>
              <button type="button" className="btn btn-secondary"
                onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
