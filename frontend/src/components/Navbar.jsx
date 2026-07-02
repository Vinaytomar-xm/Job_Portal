import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated, isCompany, isJobSeeker } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();   // calls POST /api/auth/logout → server clears httpOnly cookie
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, #6c63ff, #5eb3ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 16, color: '#fff',
          }}>J</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-1)' }}>
            Job<span style={{ color: 'var(--primary)' }}>Board</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <NavLink to="/jobs" active={isActive('/jobs')}>Browse Jobs</NavLink>

          {isAuthenticated() && isJobSeeker() && (
            <NavLink to="/dashboard" active={isActive('/dashboard')}>My Applications</NavLink>
          )}
          {isAuthenticated() && isCompany() && (
            <>
              <NavLink to="/company/dashboard" active={isActive('/company/dashboard')}>Dashboard</NavLink>
              <NavLink to="/company/post-job" active={isActive('/company/post-job')}>Post Job</NavLink>
            </>
          )}
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!isAuthenticated() ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
              <Link to="/company/register" className="btn btn-outline btn-sm" style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>
                For Companies
              </Link>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 99, padding: '6px 14px 6px 6px',
                  color: 'var(--text-1)', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13, color: '#fff',
                }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>▼</span>
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '110%',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: 8, minWidth: 180,
                  boxShadow: 'var(--shadow-lg)', zIndex: 200,
                }} onClick={() => setMenuOpen(false)}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{user?.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{user?.role?.toUpperCase()}</p>
                  </div>
                  {isJobSeeker() && (
                    <Link to="/dashboard" style={{ display: 'block', padding: '9px 12px', fontSize: 14, color: 'var(--text-2)', borderRadius: 8 }}
                      className="menu-item">My Applications</Link>
                  )}
                  {isCompany() && (
                    <Link to="/company/dashboard" style={{ display: 'block', padding: '9px 12px', fontSize: 14, color: 'var(--text-2)', borderRadius: 8 }}
                      className="menu-item">Company Dashboard</Link>
                  )}
                  <button onClick={handleLogout} style={{
                    width: '100%', textAlign: 'left', padding: '9px 12px',
                    fontSize: 14, color: 'var(--danger)', background: 'none',
                    border: 'none', cursor: 'pointer', borderRadius: 8,
                    marginTop: 4, borderTop: '1px solid var(--border)',
                  }}>Log out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
      color: active ? 'var(--primary)' : 'var(--text-2)',
      background: active ? 'rgba(108,99,255,0.1)' : 'transparent',
      textDecoration: 'none', transition: 'all 0.2s',
    }}>
      {children}
    </Link>
  );
}
