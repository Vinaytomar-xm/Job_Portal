import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getJobs, getMyApplications } from '../services/api';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Technology', 'Marketing', 'Design', 'Finance', 'Sales', 'HR', 'Operations', 'Other'];
const TYPES      = ['All', 'Full-Time', 'Part-Time', 'Internship', 'Remote', 'Freelance', 'Contract'];
const EXPERIENCE = ['All', 'Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years'];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState([]);
  const [applyJob, setApplyJob] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, isJobSeeker } = useAuth();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    type: searchParams.get('type') || 'All',
    experience: 'All',
    page: 1,
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (params.category === 'All') delete params.category;
      if (params.type === 'All') delete params.type;
      if (params.experience === 'All') delete params.experience;
      if (!params.search) delete params.search;
      params.limit = 12;

      const res = await getJobs(params);
      setJobs(res.data.jobs || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // Load applied job IDs for logged-in job seekers
  useEffect(() => {
    if (isAuthenticated() && isJobSeeker()) {
      getMyApplications().then(r => {
        setAppliedIds(r.data.applications.map(a => a.job?._id));
      }).catch(() => {});
    }
  }, [isAuthenticated, isJobSeeker]);

  const setFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val, page: 1 }));

  return (
    <div style={{ minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">
        {/* Search bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 6 }}>
          <input
            type="text"
            placeholder="Search job title, skill, company, location..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchJobs()}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-1)', fontSize: 15, padding: '10px 14px' }}
          />
          <button onClick={fetchJobs} className="btn btn-primary" style={{ borderRadius: 10 }}>Search</button>
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          {/* ── Sidebar Filters ── */}
          <aside style={{ width: 220, flexShrink: 0 }}>
            <div className="card" style={{ position: 'sticky', top: 80 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: 'var(--text-1)' }}>Filters</h3>

              <FilterGroup label="Job Type" options={TYPES} value={filters.type}
                onChange={v => setFilter('type', v)} />
              <FilterGroup label="Category" options={CATEGORIES} value={filters.category}
                onChange={v => setFilter('category', v)} />
              <FilterGroup label="Experience" options={EXPERIENCE} value={filters.experience}
                onChange={v => setFilter('experience', v)} />

              <button onClick={() => setFilters({ search: '', category: 'All', type: 'All', experience: 'All', page: 1 })}
                className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 8 }}>
                Clear Filters
              </button>
            </div>
          </aside>

          {/* ── Job Listings ── */}
          <main style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
                {loading ? 'Loading...' : `${total} job${total !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                <div className="spinner" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <h3>No jobs found</h3>
                <p>Try adjusting your filters or search query</p>
              </div>
            ) : (
              <>
                <div className="grid-auto">
                  {jobs.map(job => (
                    <JobCard key={job._id} job={job}
                      applied={appliedIds.includes(job._id)}
                      onApply={setApplyJob}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 32 }}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                        className={`btn btn-sm ${filters.page === p ? 'btn-primary' : 'btn-outline'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {applyJob && (
        <ApplyModal job={applyJob} onClose={() => setApplyJob(null)}
          onSuccess={(id) => setAppliedIds(prev => [...prev, id])} />
      )}
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>{label}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            style={{
              textAlign: 'left', padding: '7px 10px', borderRadius: 8,
              background: value === opt ? 'rgba(108,99,255,0.12)' : 'transparent',
              border: `1px solid ${value === opt ? 'rgba(108,99,255,0.3)' : 'transparent'}`,
              color: value === opt ? 'var(--primary)' : 'var(--text-2)',
              fontSize: 13, fontWeight: value === opt ? 600 : 400,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
