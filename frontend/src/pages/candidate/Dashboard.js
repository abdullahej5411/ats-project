// src/pages/candidate/Dashboard.js

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my')
      .then(r => setApps(r.data.applications))
      .finally(() => setLoading(false));
  }, []);

  const statusCount = (s) => apps.filter(a => a.status === s).length;

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">Welcome, {user?.name}! 👋</h1>
        <p className="page-subtitle">Here's a summary of your job applications</p>

        {/* Stats */}
        <div className="grid-3" style={{ marginBottom:'28px' }}>
          {[
            { label:'Total Applied',   value: apps.length,           color:'#2563eb' },
            { label:'Under Review',    value: statusCount('Under Review'), color:'#d97706' },
            { label:'Shortlisted',     value: statusCount('Shortlisted'),  color:'#16a34a' },
            { label:'Interview Scheduled', value: statusCount('Interview Scheduled'), color:'#7c3aed' },
            { label:'Selected',        value: statusCount('Selected'),     color:'#065f46' },
            { label:'Rejected',        value: statusCount('Rejected'),     color:'#dc2626' },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign:'center', borderTop:`3px solid ${s.color}` }}>
              <div style={{ fontSize:'30px', fontWeight:'700', color:s.color }}>{s.value}</div>
              <div style={{ fontSize:'13px', color:'#6b7280', marginTop:'4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid-2" style={{ marginBottom:'28px' }}>
          <Link to="/jobs" className="card" style={{ textAlign:'center', cursor:'pointer', textDecoration:'none', color:'inherit' }}>
            <div style={{ fontSize:'32px' }}>🔍</div>
            <h3 style={{ margin:'8px 0 4px' }}>Browse Jobs</h3>
            <p style={{ fontSize:'13px', color:'#6b7280' }}>Find new opportunities</p>
          </Link>
          <Link to="/candidate/profile" className="card" style={{ textAlign:'center', cursor:'pointer', textDecoration:'none', color:'inherit' }}>
            <div style={{ fontSize:'32px' }}>👤</div>
            <h3 style={{ margin:'8px 0 4px' }}>Update Profile</h3>
            <p style={{ fontSize:'13px', color:'#6b7280' }}>Keep your info current</p>
          </Link>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <h3>Recent Applications</h3>
            <Link to="/candidate/applications" style={{ fontSize:'14px', color:'#2563eb' }}>View All</Link>
          </div>

          {loading ? <div className="spinner" /> : apps.length === 0 ? (
            <div className="empty">
              <h3>No applications yet</h3>
              <p>Start by browsing open jobs</p>
              <Link to="/jobs" className="btn btn-primary" style={{ marginTop:'12px' }}>Browse Jobs</Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Job Title</th><th>Branch</th><th>Applied On</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {apps.slice(0,5).map(a => (
                    <tr key={a._id}>
                      <td>{a.job?.title}</td>
                      <td>{a.job?.branch?.name}</td>
                      <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
