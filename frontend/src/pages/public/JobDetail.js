// src/pages/public/JobDetail.js

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function JobDetail() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(r => setJob(r.data.job))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-wrapper"><div className="spinner" /></div>;
  if (!job)    return <div className="page-wrapper"><div className="container"><p>Job not found.</p></div></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth:'800px' }}>

        {/* Header */}
        <div className="card" style={{ background:'linear-gradient(135deg,#1e293b,#2563eb)', color:'#fff' }}>
          <span style={{ fontSize:'12px', background:'rgba(255,255,255,0.2)',
            padding:'3px 10px', borderRadius:'12px', fontWeight:'600' }}>
            {job.department}
          </span>
          <h1 style={{ margin:'12px 0 8px', fontSize:'28px' }}>{job.title}</h1>
          <div style={{ display:'flex', gap:'20px', flexWrap:'wrap', fontSize:'14px', color:'#cbd5e1' }}>
            <span>📍 {job.branch?.name}, {job.branch?.city}</span>
            <span>💼 {job.type}</span>
            <span>🪑 {job.seats} seat(s)</span>
            <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
          </div>
          {job.salaryRange?.min && (
            <p style={{ marginTop:'8px', fontSize:'14px', color:'#a5f3fc' }}>
              💰 PKR {job.salaryRange.min.toLocaleString()} – {job.salaryRange.max.toLocaleString()}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="card">
          <h3 style={{ marginBottom:'12px', fontSize:'18px' }}>Job Description</h3>
          <p style={{ whiteSpace:'pre-line', color:'#374151', lineHeight:'1.7' }}>{job.description}</p>
        </div>

        {/* Requirements */}
        <div className="card">
          <h3 style={{ marginBottom:'12px', fontSize:'18px' }}>Requirements</h3>
          <p style={{ whiteSpace:'pre-line', color:'#374151', lineHeight:'1.7' }}>{job.requirements}</p>
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="card">
            <h3 style={{ marginBottom:'12px', fontSize:'18px' }}>Skills Required</h3>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {job.skills.map(s => (
                <span key={s} style={{ background:'#dbeafe', color:'#1d4ed8',
                  padding:'4px 12px', borderRadius:'20px', fontSize:'13px', fontWeight:'600' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <div className="card" style={{ textAlign:'center' }}>
          {!user ? (
            <>
              <p style={{ marginBottom:'12px', color:'#6b7280' }}>You must be logged in to apply.</p>
              <Link to="/login" className="btn btn-primary">Login to Apply</Link>
            </>
          ) : user.role === 'candidate' ? (
            <Link to={`/candidate/apply/${job._id}`} className="btn btn-success"
              style={{ fontSize:'16px', padding:'12px 36px' }}>
              Apply Now
            </Link>
          ) : (
            <p style={{ color:'#6b7280' }}>HR accounts cannot apply for jobs.</p>
          )}
        </div>
      </div>
    </div>
  );
}
