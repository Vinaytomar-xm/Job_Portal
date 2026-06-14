import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyJobs, getCompanyApps, updateAppStatus, deleteJob } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'];
const STATUS_INFO = {
  pending:     { color: '#8888a8', label: 'Pending',     icon: '⏳' },
  reviewed:    { color: '#ff9f6b', label: 'Under Review', icon: '👀' },
  shortlisted: { color: '#5eb3ff', label: 'Shortlisted',  icon: '⭐' },
  accepted:    { color: '#43d9a2', label: 'Accepted',     icon: '🎉' },
  rejected:    { color: '#ff6584', label: 'Rejected',     icon: '😔' },
};

const TABS = ['My Jobs', 'Applications'];

export default function CompanyDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('My Jobs');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [filterJobId, setFilterJobId] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    getMyJobs()
      .then(r => setJobs(r.data.jobs || []))
      .catch(() => {})
      .finally(() => setLoadingJobs(false));
  }, []);

  useEffect(() => {
    if (tab !== 'Applications') return;
    setLoadingApps(true);
    const params = {};
    if (filterJobId) params.jobId = filterJobId;
    if (filterStatus !== 'All') params.status = filterStatus;
    getCompanyApps(params)
      .then(r => setApplications(r.data.applications || []))
      .catch(() => {})
      .finally(() => setLoadingApps(false));
  }, [tab, filterJobId, filterStatus]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await updateAppStatus(appId, { status: newStatus });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
      toast.success(`Application marked as ${STATUS_INFO[newStatus]?.label} · Email sent to candidate ✉️`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId);
      setJobs(prev => prev.filter(j => j._id !== jobId));
      toast.success('Job deleted');
      setConfirmDelete(null);
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  const totalApps = jobs.reduce((s, j) => s + (j.applicationsCount || 0), 0);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-1)' }}>
              {user?.companyName || user?.name}'s Dashboard
            </h1>
            <p style={{ color: 'var(--text-2)', marginTop: 6 }}>Manage your job postings and review applications</p>
          </div>
          <Link to="/company/post-job" className="btn btn-primary">
            + Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Active Jobs', value: jobs.filter(j => j.isActive).length, color: 'var(--accent)' },
            { label: 'Total Jobs', value: jobs.length, color: 'var(--primary)' },
            { label: 'Total Applications', value: totalApps, color: 'var(--secondary)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: '10px 20px', background: 'none', border: 'none',
                color: tab === t ? 'var(--primary)' : 'var(--text-2)',
                fontFamily: 'inherit', fontSize: 15, fontWeight: tab === t ? 700 : 400,
                cursor: 'pointer', borderBottom: `2px solid ${tab === t ? 'var(--primary)' : 'transparent'}`,
                marginBottom: -1, transition: 'all 0.15s',
              }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── MY JOBS TAB ── */}
        {tab === 'My Jobs' && (
          <>
            {loadingJobs ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <h3>No jobs posted yet</h3>
                <p>Post your first job to start receiving applications</p>
                <Link to="/company/post-job" className="btn btn-primary" style={{ marginTop: 20 }}>Post a Job</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {jobs.map(job => (
                  <div key={job._id} className="card" style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '20px 24px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>{job.title}</h3>
                        <span className={`badge ${job.isActive ? 'badge-accent' : 'badge-muted'}`}>
                          {job.isActive ? 'Active' : 'Closed'}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
                        {job.location} · {job.type} · {job.category}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
                        Posted {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div style={{ textAlign: 'center', padding: '8px 20px', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{job.applicationsCount || 0}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Applications</p>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm"
                        onClick={() => { setTab('Applications'); setFilterJobId(job._id); }}>
                        View Applications
                      </button>
                      <button className="btn btn-danger btn-sm"
                        onClick={() => setConfirmDelete(job._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── APPLICATIONS TAB ── */}
        {tab === 'Applications' && (
          <>
            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <select className="form-input" style={{ width: 'auto', minWidth: 180 }}
                value={filterJobId} onChange={e => setFilterJobId(e.target.value)}>
                <option value="">All Jobs</option>
                {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
              </select>
              <select className="form-input" style={{ width: 'auto', minWidth: 160 }}
                value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="All">All Statuses</option>
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{STATUS_INFO[s].icon} {STATUS_INFO[s].label}</option>
                ))}
              </select>
            </div>

            {loadingApps ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
            ) : applications.length === 0 ? (
              <div className="empty-state">
                <h3>No applications found</h3>
                <p>No applications match your current filters.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {applications.map(app => {
                  const info = STATUS_INFO[app.status] || STATUS_INFO.pending;
                  const applicant = app.applicant;
                  return (
                    <div key={app._id} className="card fade-in" style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        {/* Applicant avatar */}
                        <div className="avatar avatar-sm" style={{
                          background: 'linear-gradient(135deg, #5eb3ff, #43d9a2)',
                          flexShrink: 0,
                        }}>
                          {applicant?.name?.[0]?.toUpperCase() || 'U'}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>
                              {applicant?.name || 'Unknown'}
                            </h3>
                            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>·</span>
                            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{applicant?.email}</span>
                            {applicant?.phone && (
                              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>· {applicant.phone}</span>
                            )}
                          </div>
                          <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
                            Applied for: <strong style={{ color: 'var(--text-1)' }}>{app.job?.title}</strong>
                          </p>
                          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                            {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>

                          {/* Cover letter */}
                          {app.coverLetter && (
                            <p style={{
                              fontSize: 13, color: 'var(--text-2)', marginTop: 10,
                              background: 'var(--bg-hover)', padding: '10px 14px', borderRadius: 8,
                              borderLeft: '3px solid var(--primary)',
                              maxHeight: 80, overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {app.coverLetter}
                            </p>
                          )}

                          {/* Resume */}
                          {app.resumeUrl && (
                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer"
                              className="btn btn-outline btn-sm" style={{ marginTop: 10, display: 'inline-flex' }}>
                              📄 View Resume
                            </a>
                          )}
                        </div>

                        {/* Status control */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
                          {/* Current status badge */}
                          <div style={{
                            background: `${info.color}18`, border: `1px solid ${info.color}44`,
                            borderRadius: 99, padding: '5px 14px',
                            display: 'flex', alignItems: 'center', gap: 5,
                          }}>
                            <span style={{ fontSize: 13 }}>{info.icon}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: info.color }}>{info.label}</span>
                          </div>

                          {/* Update dropdown */}
                          <select
                            value={app.status}
                            disabled={updatingId === app._id}
                            onChange={e => handleStatusChange(app._id, e.target.value)}
                            style={{
                              background: 'var(--bg-input)', border: '1px solid var(--border)',
                              color: 'var(--text-1)', borderRadius: 8, padding: '7px 10px',
                              fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
                            }}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{STATUS_INFO[s].icon} {STATUS_INFO[s].label}</option>
                            ))}
                          </select>

                          {updatingId === app._id && (
                            <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Sending email...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div className="card" style={{ padding: 32, maxWidth: 400, width: '100%' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Delete Job?</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 24 }}>
              This will permanently delete the job posting. All associated applications will remain but the job will be gone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDeleteJob(confirmDelete)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
