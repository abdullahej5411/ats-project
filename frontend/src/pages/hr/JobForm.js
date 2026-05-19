// src/pages/hr/JobForm.js — Create and Edit Job

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const DEPARTMENTS = ['Engineering','Design','Marketing','HR','Finance','Sales','Operations'];
const TYPES       = ['Full-Time','Part-Time','Contract','Internship'];

export default function JobForm() {
  const { id }     = useParams();       // if id exists → edit mode
  const navigate   = useNavigate();
  const isEdit     = !!id;

  const [branches, setBranches] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [form, setForm] = useState({
    title:'', department:'Engineering', branch:'', description:'',
    requirements:'', type:'Full-Time', seats:1,
    deadline:'', skills:'', salaryMin:'', salaryMax:''
  });

  useEffect(() => {
    api.get('/branches').then(r => setBranches(r.data.branches));
    if (isEdit) {
      api.get(`/jobs/${id}`).then(r => {
        const j = r.data.job;
        setForm({
          title:       j.title,
          department:  j.department,
          branch:      j.branch?._id || '',
          description: j.description,
          requirements:j.requirements,
          type:        j.type,
          seats:       j.seats,
          deadline:    j.deadline?.slice(0,10),
          skills:      j.skills?.join(', ') || '',
          salaryMin:   j.salaryRange?.min || '',
          salaryMax:   j.salaryRange?.max || ''
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      seats:  Number(form.seats),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      salaryRange: { min: Number(form.salaryMin), max: Number(form.salaryMax) }
    };
    try {
      if (isEdit) {
        await api.put(`/jobs/${id}`, payload);
        toast.success('Job updated successfully');
      } else {
        await api.post('/jobs', payload);
        toast.success('Job posted successfully');
      }
      navigate('/hr/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth:'750px' }}>
        <h1 className="page-title">{isEdit ? 'Edit Job' : 'Post New Job'}</h1>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Job Title *</label>
                <input name="title" value={form.title} onChange={handleChange}
                  required placeholder="e.g. Senior React Developer" />
              </div>
              <div className="form-group">
                <label>Department *</label>
                <select name="department" value={form.department} onChange={handleChange}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Branch *</label>
                <select name="branch" value={form.branch} onChange={handleChange} required>
                  <option value="">Select Branch</option>
                  {branches.map(b => <option key={b._id} value={b._id}>{b.name} — {b.city}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Job Type *</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Seats Available *</label>
                <input type="number" name="seats" value={form.seats}
                  onChange={handleChange} required min="1" />
              </div>
              <div className="form-group">
                <label>Application Deadline *</label>
                <input type="date" name="deadline" value={form.deadline}
                  onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Job Description *</label>
              <textarea name="description" value={form.description}
                onChange={handleChange} required rows={5}
                placeholder="Describe the role, responsibilities, team..." />
            </div>

            <div className="form-group">
              <label>Requirements *</label>
              <textarea name="requirements" value={form.requirements}
                onChange={handleChange} required rows={4}
                placeholder="List qualifications, education, years of experience..." />
            </div>

            <div className="form-group">
              <label>Required Skills (comma separated)</label>
              <input name="skills" value={form.skills} onChange={handleChange}
                placeholder="React, Node.js, MongoDB, REST APIs" />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Min Salary (PKR)</label>
                <input type="number" name="salaryMin" value={form.salaryMin} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Max Salary (PKR)</label>
                <input type="number" name="salaryMax" value={form.salaryMax} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display:'flex', gap:'12px' }}>
              <button type="button" className="btn btn-secondary"
                onClick={() => navigate('/hr/jobs')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
