// src/pages/candidate/MyInterviews.js

import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function MyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    api.get('/interviews/my')
      .then(r => setInterviews(r.data.interviews))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = s => ({ Scheduled:'#7c3aed', Completed:'#16a34a', Cancelled:'#dc2626' }[s] || '#6b7280');

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">My Interviews</h1>
        <p className="page-subtitle">{interviews.length} interview(s) scheduled</p>

        {loading ? <div className="spinner" /> : interviews.length === 0 ? (
          <div className="empty">
            <h3>No interviews scheduled yet</h3>
            <p>Keep applying and we'll notify you when an interview is set</p>
          </div>
        ) : interviews.map(iv => (
          <div key={iv._id} className="card">
            <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
              <div>
                <h3 style={{ marginBottom:'8px' }}>{iv.job?.title}</h3>
                <div style={{ display:'flex', gap:'20px', flexWrap:'wrap', fontSize:'14px', color:'#6b7280' }}>
                  <span>📅 {new Date(iv.scheduledDate).toDateString()}</span>
                  <span>⏰ {iv.scheduledTime}</span>
                  <span>🎯 {iv.type}</span>
                  {iv.location && <span>📌 {iv.location}</span>}
                </div>
                {iv.messageToCandidate && (
                  <div style={{ marginTop:'12px', background:'#f0f9ff', padding:'10px 14px',
                    borderRadius:'6px', fontSize:'14px', color:'#374151', borderLeft:'3px solid #2563eb' }}>
                    <strong>Note from HR:</strong> {iv.messageToCandidate}
                  </div>
                )}
              </div>
              <span style={{ background: statusColor(iv.status)+'20', color: statusColor(iv.status),
                padding:'4px 12px', borderRadius:'20px', fontWeight:'600', fontSize:'13px',
                height:'fit-content' }}>
                {iv.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
