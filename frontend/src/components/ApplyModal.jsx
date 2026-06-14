import { useState } from 'react';
import { applyToJob } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function ApplyModal({ job, onClose, onSuccess }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await applyToJob(job._id, { coverLetter, resumeUrl });
      toast.success('Application submitted! 🎉');
      onSuccess && onSuccess(job._id);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16, backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 32, width: '100%', maxWidth: 520,
        boxShadow: 'var(--shadow-lg)',
      }} onClick={e => e.stopPropagation()} className="fade-in">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>Apply for Position</h2>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 4 }}>
              {job.title} · {job.companyName}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group">
            <label className="form-label">Resume / Portfolio Link (optional)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://your-resume.com or drive link"
              value={resumeUrl}
              onChange={e => setResumeUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cover Letter <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span></label>
            <textarea
              className="form-input"
              rows={5}
              placeholder="Tell the company why you're a great fit for this role..."
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
            />
          </div>

          <div style={{ padding: 14, background: 'rgba(108,99,255,0.08)', borderRadius: 10, border: '1px solid rgba(108,99,255,0.2)' }}>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
              📧 You'll receive an email at your registered address when the company reviews your application.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
