// src/pages/hr/Dashboard.js

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function HRDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/stats')
      .then(r => setStats(r.data.stats))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label:'Total Applications', value: stats.total,       color:'#2563eb' },
    { label:'Submitted',          value: stats.submitted,   color:'#6b7280' },
    { label:'Under Review',       value: stats.underReview, color:'#d97706' },
    { label:'Shortlisted',        value: stats.shortlisted, color:'#16a34a' },
    { label:'Interviews',         value: stats.scheduled,   color:'#7c3aed' },
    { label:'Selected',           value: stats.selected,    color:'#065f46' },
    { label:'Rejected',           value: stats.rejected,    color:'#dc2626' },
  ] : [];

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">HR Dashboard</h1>
        <p className="page-subtitle">Overview of all recruitment activity</p>

        {loading ? <div className="spinner" /> : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:'16px', marginBottom:'32px' }}>
            {cards.map(c => (
              <div key={c.label} className="card" style={{ textAlign:'center', borderTop:`3px solid ${c.color}` }}>
                <div style={{ fontSize:'32px', fontWeight:'700', color:c.color }}>{c.value}</div>
                <div style={{ fontSize:'13px', color:'#6b7280', marginTop:'4px' }}>{c.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <h3 style={{ marginBottom:'16px', fontSize:'18px' }}>Quick Actions</h3>
        <div className="grid-3">
          {[
            { to:'/hr/jobs/new',      icon:'➕', label:'Post New Job',        desc:'Create a new job listing' },
            { to:'/hr/applications',  icon:'📋', label:'View Applications',   desc:'Review all applicants' },
            { to:'/hr/interviews',    icon:'📅', label:'Manage Interviews',   desc:'Schedule & track interviews' },
            { to:'/hr/jobs',          icon:'💼', label:'Manage Jobs',         desc:'Edit or close job postings' },
            { to:'/hr/branches',      icon:'🏢', label:'Manage Branches',     desc:'Add or update office branches' },
          ].map(a => (
            <Link key={a.to} to={a.to} className="card"
              style={{ textDecoration:'none', color:'inherit', cursor:'pointer',
                transition:'transform 0.2s', display:'block' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              <div style={{ fontSize:'30px', marginBottom:'8px' }}>{a.icon}</div>
              <h4 style={{ marginBottom:'4px' }}>{a.label}</h4>
              <p style={{ fontSize:'13px', color:'#6b7280' }}>{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
