// src/pages/public/Home.js

import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Your Next Opportunity</h1>
        <p style={styles.heroSub}>
          Browse open positions across our Islamabad, Lahore, Karachi and Remote offices.
        </p>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/jobs" className="btn btn-primary" style={{ fontSize:'16px', padding:'12px 32px' }}>
            Browse Jobs
          </Link>
          {!user && (
            <Link to="/register" className="btn btn-outline" style={{ fontSize:'16px', padding:'12px 32px', background:'transparent', border:'2px solid #fff', color:'#fff' }}>
              Create Account
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="container" style={{ marginTop:'60px' }}>
        <h2 style={{ textAlign:'center', marginBottom:'32px', fontSize:'24px' }}>How It Works</h2>
        <div className="grid-3">
          {[
            { icon:'🔍', title:'Search Jobs',    desc:'Browse open positions filtered by branch, department, or job type.' },
            { icon:'📄', title:'Apply Online',   desc:'Upload your resume and cover letter directly through the portal.' },
            { icon:'📊', title:'Track Status',   desc:'Log in anytime to see where your application stands in the pipeline.' }
          ].map(f => (
            <div key={f.title} className="card" style={{ textAlign:'center' }}>
              <div style={{ fontSize:'40px', marginBottom:'12px' }}>{f.icon}</div>
              <h3 style={{ marginBottom:'8px' }}>{f.title}</h3>
              <p style={{ color:'#6b7280', fontSize:'14px' }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Branch Cards */}
        <h2 style={{ textAlign:'center', margin:'48px 0 28px', fontSize:'24px' }}>Our Offices</h2>
        <div className="grid-2">
          {[
            { city:'Islamabad', emoji:'🏛️', desc:'Federal Capital — Main headquarters' },
            { city:'Lahore',    emoji:'🌆', desc:'Punjab\'s tech hub' },
            { city:'Karachi',   emoji:'🌊', desc:'Financial capital office' },
            { city:'Remote',    emoji:'🌐', desc:'Work from anywhere in Pakistan' }
          ].map(b => (
            <div key={b.city} className="card" style={{ display:'flex', alignItems:'center', gap:'16px' }}>
              <span style={{ fontSize:'36px' }}>{b.emoji}</span>
              <div>
                <h3 style={{ marginBottom:'4px' }}>{b.city}</h3>
                <p style={{ color:'#6b7280', fontSize:'14px' }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1e293b 0%, #2563eb 100%)',
    color: '#fff', textAlign: 'center', padding: '80px 20px'
  },
  heroTitle: { fontSize: '42px', fontWeight: '800', marginBottom: '16px' },
  heroSub:   { fontSize: '18px', color: '#cbd5e1', marginBottom: '32px', maxWidth:'600px', margin:'0 auto 32px' }
};
