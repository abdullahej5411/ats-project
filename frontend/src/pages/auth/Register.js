// src/pages/auth/Register.js

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [form, setForm]       = useState({
    name:'', email:'', password:'', role:'candidate', hrCode:''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.user);
      toast.success('Account created successfully!');
      navigate(data.user.role === 'hr' ? '/hr' : '/candidate');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="card" style={{ width:'100%', maxWidth:'460px' }}>
        <h2 className="page-title" style={{ textAlign:'center' }}>Create Account</h2>
        <p className="page-subtitle" style={{ textAlign:'center' }}>Join the ATS Portal</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              required placeholder="Ali Ahmed" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email}
              onChange={handleChange} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password}
              onChange={handleChange} required minLength={6} placeholder="Min 6 characters" />
          </div>
          <div className="form-group">
            <label>Register As</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="candidate">Candidate</option>
              <option value="hr">HR / Admin</option>
            </select>
          </div>
          {form.role === 'hr' && (
            <div className="form-group">
              <label>HR Registration Code</label>
              <input name="hrCode" value={form.hrCode} onChange={handleChange}
                placeholder="Enter HR code provided by admin" />
            </div>
          )}
          <button type="submit" className="btn btn-primary"
            style={{ width:'100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'16px', fontSize:'14px', color:'#6b7280' }}>
          Already have an account? <Link to="/login" style={{ color:'#2563eb' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
