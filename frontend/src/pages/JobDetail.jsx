import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob, checkApplied } from '../services/api';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';

const TYPE_COLORS = {
  'Full-Time': 'badge-accent', 'Internship': 'badge-info',
  'Remote': 'badge-primary', 'Part-Time': 'badge-warning',
  'Freelance': 'badge-warning', 'Contract': 'badge-muted',
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applyModal, setApplyModal] = useState(false);

  useEffect(() => {
    getJob(id)
      .then(r => setJob(r.data.job))
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isAuthenticated() && isJobSeeker() && id) {
      checkApplied(id).then(r => setApplied(r.data.applied)).catch(() => {});
    }
  }, [id, isAuthenticated, isJobSeeker]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!job) return null;

  const initials = job.companyName?.slice(0, 2).toUpperCase();

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }}>
          ← Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header card */}
            <div className="card">
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', marginBottom: 20 }}>
                <div className="avatar avatar-lg">{initials}</div>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-1)', marginBottom: 4 }}>{job.title}</h1>
                  <p style={{ fontSize: 15, color: 'var(--text-2)' }}>{job.companyName}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <span className={`badge ${TYPE_COLORS[job.type] || 'badge-muted'}`}>{job.type}</span>
                <span className="badge badge-muted">📍 {job.location}</span>
                <span className="badge badge-muted">🎯 {job.experience}</span>
                {job.salary && job.salary !== 'Not Disclosed' && (
                  <span className="badge badge-muted">💰 {job.salary}</span>
                )}
                <span className="badge badge-muted">🗂 {job.category}</span>
                {job.openings && <span className="badge badge-muted">👥 {job.openings} opening{job.openings > 1 ? 's' : ''}</span>}
                {job.deadline && (
                  <span className="badge badge-danger">🗓 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="card">
              <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, color: 'var(--text-1)' }}>Job Description</h2>
              <div style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="card">
                <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, color: 'var(--text-1)' }}>Requirements</h2>
                <div style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="card">
                <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, color: 'var(--text-1)' }}>Skills Required</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {job.skills.map(skill => (
                    <span key={skill} className="badge badge-primary">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              {applied ? (
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                  <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 16 }}>Already Applied</p>
                  <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 6 }}>
                    You'll get an email when the company responds.
                  </p>
                </div>
              ) : (
                <>
                  {isAuthenticated() && isJobSeeker() ? (
                    <button className="btn btn-primary btn-lg" style={{ width: '100%' }}
                      onClick={() => setApplyModal(true)}>
                      Apply Now
                    </button>
                  ) : isAuthenticated() ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>
                      Company accounts can't apply to jobs.
                    </p>
                  ) : (
                    <>
                      <button className="btn btn-primary btn-lg" style={{ width: '100%' }}
                        onClick={() => navigate('/login')}>
                        Login to Apply
                      </button>
                      <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 13, marginTop: 12 }}>
                        Don't have an account?{' '}
                        <a href="/register" style={{ color: 'var(--primary)' }}>Sign up free</a>
                      </p>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Company info */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>About Company</h3>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <div className="avatar avatar-sm">{initials}</div>
                <p style={{ fontWeight: 600, color: 'var(--text-1)' }}>{job.companyName}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <InfoRow icon="📍" label={job.location} />
                <InfoRow icon="🗂" label={job.category} />
                <InfoRow icon="📅" label={`Posted ${new Date(job.createdAt).toLocaleDateString()}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {applyModal && (
        <ApplyModal job={job} onClose={() => setApplyModal(false)}
          onSuccess={() => setApplied(true)} />
      )}
    </div>
  );
}

function InfoRow({ icon, label }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
    </div>
  );
}
