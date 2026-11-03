import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOtp, resetPassword } from '../services/api';
import { useToast } from '../context/ToastContext';
import { FaEye } from 'react-icons/fa';
import { GoEyeClosed } from 'react-icons/go';

// Step 1: Email → Step 2: OTP → Step 3: New Password
export default function ForgotPassword() {
  const [step, setStep]           = useState(1);
  const [email, setEmail]         = useState('');
  const [otp, setOtp]             = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const toast    = useToast();
  const navigate = useNavigate();

  // ── Step 1: Send OTP ─────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await forgotPassword({ email });
      toast.success('OTP sent! Check your email 📧');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      toast.success('OTP verified! ✅');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ───────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || !confirm) { toast.error('Fill all fields'); return; }
    if (password !== confirm)  { toast.error('Passwords do not match'); return; }
    if (password.length < 6)   { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await resetPassword({ email, password, confirmPassword: confirm });
      toast.success('Password reset successfully! Please log in 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const STEPS = ['Email', 'Verify OTP', 'New Password'];

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
          }}></div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-1)' }}>Reset Password</h1>
          <p style={{ color: 'var(--text-2)', marginTop: 6, fontSize: 14 }}>
            {step === 1 && 'Enter your registered email to receive an OTP'}
            {step === 2 && `OTP sent to ${email}`}
            {step === 3 && 'Create your new password'}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, gap: 0 }}>
          {STEPS.map((label, i) => {
            const num     = i + 1;
            const done    = step > num;
            const active  = step === num;
            return (
              <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {/* Connector line */}
                {i > 0 && (
                  <div style={{
                    position: 'absolute', left: 0, top: 16, width: '50%', height: 2,
                    background: step > i ? 'var(--primary)' : 'var(--border)',
                    transition: 'background 0.3s',
                  }} />
                )}
                {i < 2 && (
                  <div style={{
                    position: 'absolute', right: 0, top: 16, width: '50%', height: 2,
                    background: step > num ? 'var(--primary)' : 'var(--border)',
                    transition: 'background 0.3s',
                  }} />
                )}
                {/* Circle */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', zIndex: 1,
                  background: done ? 'var(--primary)' : active ? 'var(--primary)' : 'var(--bg-hover)',
                  border: `2px solid ${done || active ? 'var(--primary)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  color: done || active ? '#fff' : 'var(--text-3)',
                  transition: 'all 0.3s',
                }}>
                  {done ? '✓' : num}
                </div>
                <p style={{ fontSize: 11, color: active ? 'var(--primary)' : 'var(--text-3)', marginTop: 6, fontWeight: active ? 600 : 400 }}>
                  {label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ padding: 32 }}>

          {/* ── STEP 1: Email ── */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Registered Email Address</label>
                <input
                  type="email" className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
                {loading ? 'Sending OTP...' : 'Send OTP →'}
              </button>
            </form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Enter 6-digit OTP</label>
                <input
                  type="text" className="form-input"
                  placeholder="_ _ _ _ _ _"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  autoFocus
                  style={{ fontSize: 24, letterSpacing: 10, textAlign: 'center', fontWeight: 700 }}
                />
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>
                  OTP expires in 10 minutes · Check spam folder too
                </p>
              </div>

              <button type="submit" disabled={loading || otp.length !== 6} className="btn btn-primary btn-lg">
                {loading ? 'Verifying...' : 'Verify OTP →'}
              </button>

              {/* Resend */}
              <button type="button" className="btn btn-ghost"
                onClick={() => { setStep(1); setOtp(''); }}
                style={{ fontSize: 13 }}>
                ← Resend OTP
              </button>
            </form>
          )}

          {/* ── STEP 3: New Password ── */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoFocus
                    style={{ paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 16 }}>
                    {showPass ? <GoEyeClosed /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Re-enter new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  style={{ borderColor: confirm && password !== confirm ? 'var(--danger)' : undefined }}
                />
                {confirm && password !== confirm && (
                  <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>Passwords do not match</p>
                )}
              </div>

              {/* Password strength indicator */}
              {password && (
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 99,
                      background: password.length >= i * 4
                        ? i === 1 ? 'var(--danger)' : i === 2 ? 'var(--warning)' : 'var(--accent)'
                        : 'var(--border)',
                      transition: 'background 0.2s',
                    }} />
                  ))}
                </div>
              )}

              <button type="submit"
                disabled={loading || !password || password !== confirm}
                className="btn btn-primary btn-lg" style={{ marginTop: 4 }}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-2)', marginTop: 20 }}>
          Remember your password?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}