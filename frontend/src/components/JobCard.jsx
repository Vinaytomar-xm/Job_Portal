import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TYPE_COLORS = {
  'Full-Time':  'badge-accent',
  'Internship': 'badge-info',
  'Remote':     'badge-primary',
  'Part-Time':  'badge-warning',
  'Freelance':  'badge-warning',
  'Contract':   'badge-muted',
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function JobCard({ job, onApply, applied = false }) {
  const { isAuthenticated, isJobSeeker } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const initials = job.companyName?.slice(0, 2).toUpperCase() || 'CO';

  const handleApply = (e) => {
    e.stopPropagation();
    if (!isAuthenticated()) { navigate('/login'); return; }
    if (!isJobSeeker()) return;
    onApply && onApply(job);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="card fade-in"
      style={{
        cursor: 'pointer', transition: 'all 0.2s',
        border: `1px solid ${hovered ? 'var(--primary)' : 'var(--border)'}`,
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 8px 30px rgba(108,99,255,0.15)' : 'none',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      {/* Header */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div className="avatar avatar-sm" style={{ borderRadius: 'var(--radius-sm)' }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {job.title}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{job.companyName}</p>
        </div>
        {applied && (
          <span className="badge badge-accent" style={{ flexShrink: 0 }}>Applied</span>
        )}
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <span className={`badge ${TYPE_COLORS[job.type] || 'badge-muted'}`}>{job.type}</span>
        <span className="badge badge-muted">📍 {job.location}</span>
        {job.salary && job.salary !== 'Not Disclosed' && (
          <span className="badge badge-muted">💰 {job.salary}</span>
        )}
        {job.experience && (
          <span className="badge badge-muted">🎯 {job.experience}</span>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{timeAgo(job.createdAt)}</span>
        {!applied && isJobSeeker() && (
          <button className="btn btn-primary btn-sm" onClick={handleApply}>
            Apply Now
          </button>
        )}
        {!isAuthenticated() && (
          <button className="btn btn-primary btn-sm" onClick={handleApply}>
            Apply Now
          </button>
        )}
        {applied && (
          <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>✓ Applied</span>
        )}
      </div>
    </div>
  );
}
