// src/components/common/Navbar.js

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.brand}>🏢 ATS Portal</Link>
        <Link to="/jobs" style={styles.link}>Jobs</Link>
      </div>
      <div style={styles.right}>
        {!user ? (
          <>
            <Link to="/login"    style={styles.link}>Login</Link>
            <Link to="/register" style={{...styles.link, ...styles.btnLink}}>Register</Link>
          </>
        ) : user.role === 'hr' ? (
          <>
            <Link to="/hr"               style={styles.link}>Dashboard</Link>
            <Link to="/hr/jobs"          style={styles.link}>Jobs</Link>
            <Link to="/hr/applications"  style={styles.link}>Applications</Link>
            <Link to="/hr/interviews"    style={styles.link}>Interviews</Link>
            <Link to="/hr/branches"      style={styles.link}>Branches</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/candidate"              style={styles.link}>Dashboard</Link>
            <Link to="/candidate/applications" style={styles.link}>My Applications</Link>
            <Link to="/candidate/interviews"   style={styles.link}>Interviews</Link>
            <Link to="/candidate/profile"      style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: '#1e293b', padding: '0 24px', height: '60px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  left:  { display: 'flex', alignItems: 'center', gap: '24px' },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  brand: { color: '#f1f5f9', fontSize: '18px', fontWeight: '700' },
  link:  { color: '#cbd5e1', fontSize: '14px', transition: 'color 0.2s' },
  btnLink: {
    background: '#2563eb', color: '#fff', padding: '6px 16px',
    borderRadius: '6px', fontSize: '14px'
  },
  logoutBtn: {
    background: 'transparent', border: '1px solid #64748b',
    color: '#cbd5e1', padding: '5px 14px', borderRadius: '6px',
    cursor: 'pointer', fontSize: '13px'
  }
};
