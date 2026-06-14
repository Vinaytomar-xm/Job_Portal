import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFeatured } from '../services/api';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Sales', 'HR', 'Operations'];
const STATS = [
  { value: '10,000+', label: 'Jobs Posted' },
  { value: '5,000+', label: 'Companies' },
  { value: '50,000+', label: 'Candidates' },
  { value: '95%', label: 'Placement Rate' },
];

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [applyJob, setApplyJob] = useState(null);
  const [appliedIds, setAppliedIds] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getFeatured()
      .then(r => setFeaturedJobs(r.data.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  };

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(160deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)',
        padding: '90px 0 80px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow blobs */}
        <div style={{
          position: 'absolute', top: '10%', left: '15%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none', borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '10%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(94,179,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none', borderRadius: '50%',
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 99, padding: '6px 16px', marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>1,200+ new jobs this week</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, color: 'var(--text-1)', lineHeight: 1.1, marginBottom: 20 }}>
            Find Your<br />
            <span style={{ background: 'linear-gradient(135deg, #6c63ff, #5eb3ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Dream Career
            </span>
          </h1>

          <p style={{ fontSize: 18, color: 'var(--text-2)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Connect with top companies and land the role you deserve. Browse thousands of opportunities across every industry.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, maxWidth: 560, margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border-2)', borderRadius: 14, padding: 6, boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
            <input
              type="text"
              placeholder="Search jobs, skills, companies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                color: 'var(--text-1)', fontSize: 15, padding: '10px 14px',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 10 }}>
              🔍 Search
            </button>
          </form>

          {/* Quick links */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            {['Remote', 'Full-Time', 'Internship', 'Tech'].map(tag => (
              <button key={tag} onClick={() => navigate(`/jobs?type=${tag}`)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 99, padding: '6px 14px', fontSize: 13, color: 'var(--text-2)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-2)'; }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ borderBottom: '1px solid var(--border)', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', padding: '28px 24px', gap: 16 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary)' }}>{s.value}</p>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 8 }}>Browse by Category</h2>
          <p className="section-sub" style={{ textAlign: 'center', marginBottom: 32 }}>Explore opportunities in your field</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => navigate(`/jobs?category=${cat}`)}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '14px 22px', cursor: 'pointer',
                  color: 'var(--text-1)', fontWeight: 600, fontSize: 14,
                  transition: 'all 0.2s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.1)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-1)'; }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Jobs ── */}
      <section style={{ padding: '0 0 70px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <h2 className="section-title">Featured Jobs</h2>
              <p className="section-sub">Latest opportunities from top companies</p>
            </div>
            <Link to="/jobs" className="btn btn-outline btn-sm">View All →</Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : featuredJobs.length === 0 ? (
            <div className="empty-state">
              <h3>No jobs posted yet</h3>
              <p>Check back soon or post a job if you're a company</p>
            </div>
          ) : (
            <div className="grid-auto">
              {featuredJobs.map(job => (
                <JobCard key={job._id} job={job}
                  applied={appliedIds.includes(job._id)}
                  onApply={setApplyJob}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '60px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-1)', marginBottom: 12 }}>
            Are you hiring?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-2)', marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
            Post your jobs and reach thousands of qualified candidates. Get started for free.
          </p>
          <Link to="/company/register" className="btn btn-primary btn-lg">
            Register as Company →
          </Link>
        </div>
      </section>

      {applyJob && (
        <ApplyModal
          job={applyJob}
          onClose={() => setApplyJob(null)}
          onSuccess={(id) => setAppliedIds(prev => [...prev, id])}
        />
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
