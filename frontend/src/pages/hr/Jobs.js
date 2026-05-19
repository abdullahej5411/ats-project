// src/pages/hr/Jobs.js

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function HRJobs() {
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    setLoading(true);
    api.get('/jobs/hr/all')
      .then(r => setJobs(r.data.jobs))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      fetchJobs();
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (id, isOpen) => {
    try {
      await api.put(`/jobs/${id}/toggle`);
      toast.success(isOpen ? 'Job closed' : 'Job reopened');
      fetchJobs();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
          <div>
            <h1 className="page-title">Manage Jobs</h1>
            <p className="page-subtitle">{jobs.length} total job posting(s)</p>
          </div>
          <Link to="/hr/jobs/new" className="btn btn-primary">+ Post New Job</Link>
        </div>

        {loading ? <div className="spinner" /> : jobs.length === 0 ? (
          <div className="empty">
            <h3>No jobs posted yet</h3>
            <Link to="/hr/jobs/new" className="btn btn-primary" style={{ marginTop:'12px' }}>Post First Job</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th><th>Department</th><th>Branch</th>
                  <th>Type</th><th>Seats</th><th>Deadline</th>
                  <th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job._id}>
                    <td><strong>{job.title}</strong></td>
                    <td>{job.department}</td>
                    <td>{job.branch?.name}</td>
                    <td>{job.type}</td>
                    <td>{job.seats}</td>
                    <td>{new Date(job.deadline).toLocaleDateString()}</td>
                    <td>
                      <span style={{
                        padding:'3px 10px', borderRadius:'12px', fontSize:'12px', fontWeight:'600',
                        background: job.isOpen ? '#dcfce7' : '#fee2e2',
                        color:      job.isOpen ? '#15803d' : '#b91c1c'
                      }}>
                        {job.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                        <Link to={`/hr/jobs/edit/${job._id}`} className="btn btn-warning btn-sm">Edit</Link>
                        <button className="btn btn-secondary btn-sm"
                          onClick={() => handleToggle(job._id, job.isOpen)}>
                          {job.isOpen ? 'Close' : 'Open'}
                        </button>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(job._id)}>Delete</button>
                      </div>
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
