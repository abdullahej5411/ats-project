// src/pages/candidate/MyApplications.js

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import StatusBadge from '../../components/common/StatusBadge';

export default function MyApplications() {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my')
      .then(r => setApps(r.data.applications))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">{apps.length} application(s) submitted</p>

        {loading ? <div className="spinner" /> : apps.length === 0 ? (
          <div className="empty">
            <h3>No applications yet</h3>
            <Link to="/jobs" className="btn btn-primary" style={{ marginTop:'12px' }}>Browse Jobs</Link>
          </div>
        ) : apps.map(a => (
          <div key={a._id} className="card" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px' }}>
            <div>
              <h3 style={{ marginBottom:'6px' }}>{a.job?.title}</h3>
              <p style={{ fontSize:'13px', color:'#6b7280' }}>
                📍 {a.job?.branch?.name} · {a.job?.department}
              </p>
              <p style={{ fontSize:'13px', color:'#6b7280', marginTop:'4px' }}>
                Applied: {new Date(a.createdAt).toLocaleDateString()}
              </p>
              {a.resumeUrl && (
                <a href={a.resumeUrl} target="_blank" rel="noreferrer"
                  style={{ fontSize:'13px', color:'#2563eb', marginTop:'4px', display:'block' }}>
                  📄 View Resume
                </a>
              )}
              {a.coverLetterUrl && (
                <a href={a.coverLetterUrl} target="_blank" rel="noreferrer"
                  style={{ fontSize:'13px', color:'#2563eb', display:'block' }}>
                  📝 View Cover Letter
                </a>
              )}
            </div>
            <div style={{ textAlign:'right' }}>
              <StatusBadge status={a.status} />
              {a.status === 'Interview Scheduled' && (
                <div style={{ marginTop:'8px' }}>
                  <Link to="/candidate/interviews" className="btn btn-secondary btn-sm">
                    View Interview
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
