import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyApplications } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_INFO = {
  pending:     { color: '#8888a8', bg: 'rgba(136,136,168,0.1)', label: 'Pending',     icon: '⏳' },
  reviewed:    { color: '#ff9f6b', bg: 'rgba(255,159,107,0.1)', label: 'Under Review', icon: '👀' },
  shortlisted: { color: '#5eb3ff', bg: 'rgba(94,179,255,0.1)',  label: 'Shortlisted',  icon: '⭐' },
  accepted:    { color: '#43d9a2', bg: 'rgba(67,217,162,0.1)',  label: 'Accepted',     icon: '🎉' },
  rejected:    { color: '#ff6584', bg: 'rgba(255,101,132,0.1)', label: 'Rejected',     icon: '😔' },
};

const TABS = ['All', 'pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'];

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    getMyApplications()
      .then(r => setApplications(r.data.applications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'All'
    ? applications
    : applications.filter(a => a.status === activeTab);

  const counts = TABS.slice(1).reduce((acc, s) => {
    acc[s] = applications.filter(a => a.status === s).length;
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-1)' }}>
            My Applications
          </h1>
          <p style={{ color: 'var(--text-2)', marginTop: 6 }}>
            Hello, {user?.name} — track all your job applications here
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total Applied', value: applications.length, color: 'var(--primary)' },
            { label: 'Shortlisted',   value: counts.shortlisted || 0, color: 'var(--secondary)' },
            { label: 'Accepted',      value: counts.accepted || 0, color: 'var(--accent)' },
            { label: 'Pending',       value: counts.pending || 0, color: 'var(--warning)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab filters */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
          {TABS.map(tab => {
            const info = tab !== 'All' ? STATUS_INFO[tab] : null;
            const count = tab === 'All' ? applications.length : counts[tab] || 0;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: '7px 14px', borderRadius: 99, border: 'none',
                  background: activeTab === tab ? 'rgba(108,99,255,0.15)' : 'transparent',
                  color: activeTab === tab ? 'var(--primary)' : 'var(--text-2)',
                  fontFamily: 'inherit', fontSize: 13, fontWeight: activeTab === tab ? 700 : 400,
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                {info && <span>{info.icon}</span>}
                {tab === 'All' ? 'All' : STATUS_INFO[tab]?.label}
                <span style={{
                  background: activeTab === tab ? 'var(--primary)' : 'var(--border)',
                  color: activeTab === tab ? '#fff' : 'var(--text-3)',
                  borderRadius: 99, padding: '1px 7px', fontSize: 11, fontWeight: 700,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Applications list */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No applications here</h3>
            <p>{activeTab === 'All' ? "You haven't applied to any jobs yet." : `No applications with status "${STATUS_INFO[activeTab]?.label}".`}</p>
            {activeTab === 'All' && (
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/jobs')}>
                Browse Jobs
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(app => {
              const info = STATUS_INFO[app.status] || STATUS_INFO.pending;
              const job = app.job;
              return (
                <div key={app._id} className="card fade-in"
                  style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '20px 24px' }}>
                  {/* Logo */}
                  <div className="avatar" style={{ flexShrink: 0 }}>
                    {job?.companyName?.slice(0, 2).toUpperCase() || 'CO'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 2 }}>
                      {job?.title || 'Job no longer available'}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
                      {job?.companyName} · {job?.location} · {job?.type}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
                      Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Status */}
                  <div style={{
                    background: info.bg, border: `1px solid ${info.color}44`,
                    borderRadius: 99, padding: '6px 16px',
                    display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 14 }}>{info.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: info.color }}>{info.label}</span>
                  </div>

                  {/* Action */}
                  {job?._id && (
                    <button className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}
                      onClick={() => navigate(`/jobs/${job._id}`)}>
                      View Job
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
