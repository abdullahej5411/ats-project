// src/pages/hr/Applications.js

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import StatusBadge from '../../components/common/StatusBadge';

const STATUSES = ['','Submitted','Under Review','Shortlisted','Interview Scheduled','Rejected','Selected'];

export default function HRApplications() {
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState({ status:'', search:'' });

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filter.status) params.status = filter.status;
    api.get('/applications', { params })
      .then(r => setApps(r.data.applications))
      .finally(() => setLoading(false));
  }, [filter.status]);

  const filtered = apps.filter(a => {
    if (!filter.search) return true;
    const q = filter.search.toLowerCase();
    return (
      a.candidate?.name?.toLowerCase().includes(q) ||
      a.job?.title?.toLowerCase().includes(q) ||
      a.candidate?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">All Applications</h1>
        <p className="page-subtitle">{filtered.length} application(s)</p>

        {/* Filters */}
        <div className="card" style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'20px' }}>
          <input placeholder="Search by name, email, job..." value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
            style={{ flex:1, minWidth:'200px', padding:'9px 14px',
              border:'1px solid #d1d5db', borderRadius:'6px', fontSize:'14px' }} />
          <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}
            style={{ padding:'9px 14px', border:'1px solid #d1d5db', borderRadius:'6px', fontSize:'14px' }}>
            {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
          </select>
        </div>

        {loading ? <div className="spinner" /> : filtered.length === 0 ? (
          <div className="empty"><h3>No applications found</h3></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Candidate</th><th>Email</th><th>Job Title</th>
                  <th>Branch</th><th>Applied</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a._id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <img src={a.candidate?.profilePicUrl ||
                          `https://ui-avatars.com/api/?name=${a.candidate?.name}&background=2563eb&color=fff`}
                          alt="" style={{ width:'32px', height:'32px', borderRadius:'50%', objectFit:'cover' }} />
                        <span>{a.candidate?.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize:'13px', color:'#6b7280' }}>{a.candidate?.email}</td>
                    <td>{a.job?.title}</td>
                    <td>{a.job?.branch?.name}</td>
                    <td style={{ fontSize:'13px' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      <Link to={`/hr/applications/${a._id}`} className="btn btn-primary btn-sm">
                        View
                      </Link>
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
