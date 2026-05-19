// src/pages/hr/Interviews.js

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function HRInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading,    setLoading]    = useState(true);

  const fetchInterviews = () => {
    setLoading(true);
    api.get('/interviews')
      .then(r => setInterviews(r.data.interviews))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInterviews(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this interview?')) return;
    try {
      await api.put(`/interviews/${id}/cancel`);
      toast.success('Interview cancelled');
      fetchInterviews();
    } catch { toast.error('Failed to cancel'); }
  };

  const statusColor = s => ({ Scheduled:'#7c3aed', Completed:'#16a34a', Cancelled:'#dc2626' }[s] || '#6b7280');

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">Interviews</h1>
        <p className="page-subtitle">{interviews.length} interview(s) scheduled</p>

        {loading ? <div className="spinner" /> : interviews.length === 0 ? (
          <div className="empty">
            <h3>No interviews scheduled yet</h3>
            <p>Shortlist candidates first, then schedule interviews from their application page</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Candidate</th><th>Job</th><th>Date</th>
                  <th>Time</th><th>Type</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map(iv => (
                  <tr key={iv._id}>
                    <td>
                      <div>
                        <div style={{ fontWeight:'600' }}>{iv.candidate?.name}</div>
                        <div style={{ fontSize:'12px', color:'#6b7280' }}>{iv.candidate?.email}</div>
                      </div>
                    </td>
                    <td>
                      <div>{iv.job?.title}</div>
                      <div style={{ fontSize:'12px', color:'#6b7280' }}>{iv.job?.branch?.name}</div>
                    </td>
                    <td>{new Date(iv.scheduledDate).toDateString()}</td>
                    <td>{iv.scheduledTime}</td>
                    <td>{iv.type}</td>
                    <td>
                      <span style={{ padding:'3px 10px', borderRadius:'12px', fontSize:'12px',
                        fontWeight:'600', background: statusColor(iv.status)+'20',
                        color: statusColor(iv.status) }}>
                        {iv.status}
                      </span>
                    </td>
                    <td>
                      {iv.status === 'Scheduled' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(iv._id)}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
