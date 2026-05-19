// src/pages/hr/Branches.js

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function HRBranches() {
  const [branches,    setBranches]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [editBranch,  setEditBranch]  = useState(null);
  const [form, setForm] = useState({ name:'', city:'', address:'', contactEmail:'', contactPhone:'' });
  const [saving, setSaving] = useState(false);

  const fetchBranches = () => {
    setLoading(true);
    api.get('/branches').then(r => setBranches(r.data.branches)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBranches(); }, []);

  const openAdd = () => {
    setEditBranch(null);
    setForm({ name:'', city:'', address:'', contactEmail:'', contactPhone:'' });
    setShowForm(true);
  };

  const openEdit = (b) => {
    setEditBranch(b);
    setForm({ name:b.name, city:b.city, address:b.address||'',
      contactEmail:b.contactEmail||'', contactPhone:b.contactPhone||'' });
    setShowForm(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editBranch) {
        await api.put(`/branches/${editBranch._id}`, form);
        toast.success('Branch updated');
      } else {
        await api.post('/branches', form);
        toast.success('Branch created');
      }
      setShowForm(false);
      fetchBranches();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save branch');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this branch?')) return;
    try {
      await api.delete(`/branches/${id}`);
      toast.success('Branch deactivated');
      fetchBranches();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
          <div>
            <h1 className="page-title">Manage Branches</h1>
            <p className="page-subtitle">{branches.length} active branch(es)</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Branch</button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom:'24px', border:'2px solid #2563eb' }}>
            <h3 style={{ marginBottom:'16px' }}>{editBranch ? 'Edit Branch' : 'Add New Branch'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Branch Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name:e.target.value})}
                    required placeholder="e.g. Islamabad" />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input value={form.city} onChange={e => setForm({...form, city:e.target.value})}
                    required placeholder="e.g. Islamabad" />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input value={form.address} onChange={e => setForm({...form, address:e.target.value})}
                    placeholder="Office address" />
                </div>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input type="email" value={form.contactEmail}
                    onChange={e => setForm({...form, contactEmail:e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input value={form.contactPhone}
                    onChange={e => setForm({...form, contactPhone:e.target.value})} />
                </div>
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" className="btn btn-secondary"
                  onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editBranch ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? <div className="spinner" /> : (
          <div className="grid-2">
            {branches.map(b => (
              <div key={b._id} className="card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <h3 style={{ marginBottom:'6px' }}>{b.name}</h3>
                    <p style={{ fontSize:'13px', color:'#6b7280' }}>📍 {b.city}</p>
                    {b.address      && <p style={{ fontSize:'13px', color:'#6b7280' }}>🏢 {b.address}</p>}
                    {b.contactEmail && <p style={{ fontSize:'13px', color:'#6b7280' }}>✉️ {b.contactEmail}</p>}
                    {b.contactPhone && <p style={{ fontSize:'13px', color:'#6b7280' }}>📞 {b.contactPhone}</p>}
                  </div>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <button className="btn btn-warning btn-sm" onClick={() => openEdit(b)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b._id)}>Deactivate</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
