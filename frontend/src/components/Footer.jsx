import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)', padding: '40px 0 24px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'linear-gradient(135deg, #6c63ff, #5eb3ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, color: '#fff',
              }}>J</div>
              <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-1)' }}>JobBoard</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7 }}>
              Connecting talent with opportunity. Find your dream job or your next great hire.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px' }}>For Candidates</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/jobs" style={{ fontSize: 13, color: 'var(--text-3)' }}>Browse Jobs</Link>
              <Link to="/register" style={{ fontSize: 13, color: 'var(--text-3)' }}>Create Account</Link>
              <Link to="/dashboard" style={{ fontSize: 13, color: 'var(--text-3)' }}>My Applications</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px' }}>For Companies</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/company/register" style={{ fontSize: 13, color: 'var(--text-3)' }}>Register Company</Link>
              <Link to="/company/post-job" style={{ fontSize: 13, color: 'var(--text-3)' }}>Post a Job</Link>
              <Link to="/company/dashboard" style={{ fontSize: 13, color: 'var(--text-3)' }}>Dashboard</Link>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>© 2025 JobBoard. Built with ❤️</p>
        </div>
      </div>
    </footer>
  );
}
