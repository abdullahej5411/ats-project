// src/pages/candidate/Profile.js

import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function CandidateProfile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [form, setForm] = useState({
    name:       user?.name       || '',
    phone:      user?.phone      || '',
    skills:     user?.skills?.join(', ') || '',
    linkedIn:   user?.linkedIn   || '',
    portfolio:  user?.portfolio  || '',
    degree:     user?.education?.degree      || '',
    institution:user?.education?.institution || '',
    year:       user?.education?.year        || '',
    expYears:   user?.experience?.years      || 0,
    expSummary: user?.experience?.summary    || ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name:      form.name,
        phone:     form.phone,
        skills:    form.skills.split(',').map(s => s.trim()).filter(Boolean),
        linkedIn:  form.linkedIn,
        portfolio: form.portfolio,
        education: { degree: form.degree, institution: form.institution, year: Number(form.year) },
        experience:{ years: Number(form.expYears), summary: form.expSummary }
      };
      const { data } = await api.put('/auth/profile', payload);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePicChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('profilePic', file);
    setPicLoading(true);
    try {
      const { data } = await api.put('/auth/profile-pic', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser({ ...user, profilePicUrl: data.profilePicUrl });
      toast.success('Profile picture updated!');
    } catch {
      toast.error('Failed to upload picture');
    } finally {
      setPicLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth:'700px' }}>
        <h1 className="page-title">My Profile</h1>

        {/* Profile Picture */}
        <div className="card" style={{ display:'flex', alignItems:'center', gap:'20px' }}>
          <img src={user?.profilePicUrl || 'https://ui-avatars.com/api/?name='+user?.name+'&background=2563eb&color=fff'}
            alt="profile" style={{ width:'80px', height:'80px', borderRadius:'50%', objectFit:'cover' }} />
          <div>
            <h3>{user?.name}</h3>
            <p style={{ color:'#6b7280', fontSize:'14px', marginBottom:'8px' }}>{user?.email}</p>
            <label className="btn btn-outline btn-sm" style={{ cursor:'pointer' }}>
              {picLoading ? 'Uploading...' : 'Change Photo'}
              <input type="file" accept="image/*" onChange={handlePicChange} style={{ display:'none' }} />
            </label>
          </div>
        </div>

        {/* Profile Form */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input name="skills" value={form.skills} onChange={handleChange}
                placeholder="React, Node.js, MongoDB" />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>LinkedIn URL</label>
                <input name="linkedIn" value={form.linkedIn} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Portfolio URL</label>
                <input name="portfolio" value={form.portfolio} onChange={handleChange} />
              </div>
            </div>

            <h4 style={{ margin:'8px 0 12px', color:'#374151' }}>Education</h4>
            <div className="grid-3">
              <div className="form-group">
                <label>Degree</label>
                <input name="degree" value={form.degree} onChange={handleChange} placeholder="BSCS" />
              </div>
              <div className="form-group">
                <label>Institution</label>
                <input name="institution" value={form.institution} onChange={handleChange} placeholder="FAST-NUCES" />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input type="number" name="year" value={form.year} onChange={handleChange} placeholder="2024" />
              </div>
            </div>

            <h4 style={{ margin:'8px 0 12px', color:'#374151' }}>Experience</h4>
            <div className="grid-2">
              <div className="form-group">
                <label>Years of Experience</label>
                <input type="number" name="expYears" value={form.expYears} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label>Summary</label>
                <input name="expSummary" value={form.expSummary} onChange={handleChange}
                  placeholder="Brief work experience summary" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
