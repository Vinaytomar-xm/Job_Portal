import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCompany } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

export default function CompanyRegister() {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    companyName: '', companyWebsite: '', companySize: '', companyDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const toast      = useToast();
  const navigate   = useNavigate();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.companyName) {
      toast.error('Please fill all required fields'); return;
    }
    setLoading(true);
    try {
      const res = await registerCompany(form);
      login(res.data.user);   // token is in httpOnly cookie
      toast.success(`Welcome, ${res.data.user.companyName}! Start posting jobs 🚀`);
      navigate('/company/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 520 }} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #5eb3ff, #6c63ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 22, color: '#fff', margin: '0 auto 14px',
          }}>🏢</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-1)' }}>Register your Company</h1>
          <p style={{ color: 'var(--text-2)', marginTop: 6, fontSize: 15 }}>Post jobs and find the right candidates</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Company Details</p>

            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input type="text" className="form-input" placeholder="Acme Corp"
                value={form.companyName} onChange={e => set('companyName', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Website</label>
                <input type="url" className="form-input" placeholder="https://..."
                  value={form.companyWebsite} onChange={e => set('companyWebsite', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Company Size</label>
                <select className="form-input" value={form.companySize} onChange={e => set('companySize', e.target.value)}>
                  <option value="">Select size</option>
                  {SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">About Company</label>
              <textarea className="form-input" rows={3} placeholder="Briefly describe what your company does..."
                value={form.companyDescription} onChange={e => set('companyDescription', e.target.value)} />
            </div>

            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 4 }}>Account Details</p>

            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input type="text" className="form-input" placeholder="HR Manager / Recruiter name"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" className="form-input" placeholder="hr@company.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input type="password" className="form-input" placeholder="Min 6 chars"
                  value={form.password} onChange={e => set('password', e.target.value)} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ marginTop: 6 }}>
              {loading ? 'Registering...' : 'Register Company & Start Hiring'}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-2)' }}>
            Already registered? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-2)', marginTop: 10 }}>
            Looking for a job? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Seeker account →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
