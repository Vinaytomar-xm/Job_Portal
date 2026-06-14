import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated()) {
    navigate('/');
    return null;
  }

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      if (res.data.user.role === 'company') navigate('/company/dashboard');
      else if (res.data.user.role === 'admin') navigate('/company/dashboard');
      else navigate(from);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="fade-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #6c63ff, #5eb3ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 22, color: '#fff', margin: '0 auto 14px',
          }}>J</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-1)' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-2)', marginTop: 6, fontSize: 15 }}>Sign in to your JobBoard account</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ marginTop: 4 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-2)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create one free</Link>
          </p>
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-2)', marginTop: 10 }}>
            Are you a company?{' '}
            <Link to="/company/register" style={{ color: 'var(--secondary)', fontWeight: 600 }}>Register here →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
