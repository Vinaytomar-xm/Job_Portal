import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all required fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (!consent) { toast.error('Please agree to Terms & Privacy Policy'); return; }
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data.user);
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

            {/* ── Consent checkbox ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: `1px solid ${consent ? 'rgba(108,99,255,0.4)' : 'var(--border)'}`, transition: 'border-color 0.2s' }}>
              <input
                type="checkbox"
                id="terms-consent"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                style={{ marginTop: 3, cursor: 'pointer', accentColor: 'var(--primary)', width: 15, height: 15, flexShrink: 0 }}
              />
              <label htmlFor="terms-consent" style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, cursor: 'pointer' }}>
                I agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Privacy Policy</a>
              </label>
            </div>

            <button type="submit" disabled={loading || !consent} className="btn btn-primary btn-lg" style={{ marginTop: 4, opacity: !consent ? 0.6 : 1 }}>
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