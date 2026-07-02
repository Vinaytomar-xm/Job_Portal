import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const toast      = useToast();
  const navigate   = useNavigate();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all required fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data.user);   // token is in httpOnly cookie
      toast.success('Account created! Welcome to JobBoard 🎉');
      navigate('/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #6c63ff, #5eb3ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 22, color: '#fff', margin: '0 auto 14px',
          }}>J</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-1)' }}>Create your account</h1>
          <p style={{ color: 'var(--text-2)', marginTop: 6, fontSize: 15 }}>Join thousands of job seekers on JobBoard</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-input" placeholder="John Doe"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" placeholder="+91 9999999999"
                value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input type="password" className="form-input" placeholder="At least 6 characters"
                value={form.password} onChange={e => set('password', e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ marginTop: 4 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-2)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-2)', marginTop: 10 }}>
            Hiring?{' '}
            <Link to="/company/register" style={{ color: 'var(--secondary)', fontWeight: 600 }}>Register as company →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
