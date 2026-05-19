// src/pages/public/JobList.js

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function JobList() {
  const [jobs,     setJobs]     = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filters,  setFilters]  = useState({ branch:'', department:'', type:'', search:'' });
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);
  const LIMIT = 9;

  useEffect(() => { api.get('/branches').then(r => setBranches(r.data.branches)); }, []);

  useEffect(() => {
    setLoading(true);
    const params = { ...filters, page, limit: LIMIT };
    api.get('/jobs', { params })
      .then(r => { setJobs(r.data.jobs); setTotal(r.data.total); })
      .finally(() => setLoading(false));
  }, [filters, page]);

  const handleFilter = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const departments = ['Engineering','Design','Marketing','HR','Finance','Sales','Operations'];
  const types       = ['Full-Time','Part-Time','Contract','Internship'];

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">Open Positions</h1>
        <p className="page-subtitle">{total} job(s) available</p>

        {/* Filters */}
        <div className="card" style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'24px' }}>
          <input name="search" placeholder="Search jobs..." value={filters.search}
            onChange={handleFilter}
            style={{ flex:1, minWidth:'180px', padding:'9px 14px', border:'1px solid #d1d5db', borderRadius:'6px', fontSize:'14px' }} />

          <select name="branch" value={filters.branch} onChange={handleFilter}
            style={{ padding:'9px 14px', border:'1px solid #d1d5db', borderRadius:'6px', fontSize:'14px' }}>
            <option value="">All Branches</option>
            {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>

          <select name="department" value={filters.department} onChange={handleFilter}
            style={{ padding:'9px 14px', border:'1px solid #d1d5db', borderRadius:'6px', fontSize:'14px' }}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select name="type" value={filters.type} onChange={handleFilter}
            style={{ padding:'9px 14px', border:'1px solid #d1d5db', borderRadius:'6px', fontSize:'14px' }}>
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : jobs.length === 0 ? (
          <div className="empty"><h3>No jobs found</h3><p>Try adjusting your filters</p></div>
        ) : (
          <>
            <div className="grid-3">
              {jobs.map(job => (
                <div key={job._id} className="card" style={{ display:'flex', flexDirection:'column' }}>
                  <div style={{ flex:1 }}>
                    <span style={{ fontSize:'12px', color:'#2563eb', fontWeight:'600',
                      background:'#dbeafe', padding:'2px 8px', borderRadius:'12px' }}>
                      {job.department}
                    </span>
                    <h3 style={{ margin:'10px 0 6px', fontSize:'17px' }}>{job.title}</h3>
                    <p style={{ fontSize:'13px', color:'#6b7280', marginBottom:'4px' }}>
                      📍 {job.branch?.name} — {job.branch?.city}
                    </p>
                    <p style={{ fontSize:'13px', color:'#6b7280', marginBottom:'4px' }}>
                      💼 {job.type}
                    </p>
                    <p style={{ fontSize:'13px', color:'#6b7280' }}>
                      🪑 {job.seats} seat(s) · Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm"
                    style={{ marginTop:'14px', textAlign:'center' }}>
                    View Details
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'24px' }}>
              <button className="btn btn-secondary btn-sm"
                disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ padding:'6px 14px', fontSize:'14px' }}>
                Page {page} of {Math.ceil(total / LIMIT)}
              </span>
              <button className="btn btn-secondary btn-sm"
                disabled={page >= Math.ceil(total / LIMIT)} onClick={() => setPage(p => p + 1)}>
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
