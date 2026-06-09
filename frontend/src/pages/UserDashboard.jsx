import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../services/api';
import { showToast } from '../components/Toast';
import Sidebar from '../components/Sidebar';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';
import ApplicationCard from '../components/ApplicationCard';
import './Dashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  // ─── LOAD JOBS ───────────────────────────────────────────────
  const loadJobs = async (keyword = '') => {
    setLoading(true);
    try {
      const response = await jobsAPI.getAll({ keyword });
      setJobs(response.data.jobs || []);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ─── LOAD APPLICATIONS ───────────────────────────────────────
  const loadApplications = async () => {
    try {
      const response = await applicationsAPI.getMy();
      setApplications(response.data.applications || []);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load applications', 'error');
    }
  };

  // ─── INITIAL LOAD ────────────────────────────────────────────
  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  // ─── HANDLE SEARCH ───────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    loadJobs(searchKeyword);
  };

  // ─── VIEW JOB DETAILS ────────────────────────────────────────
  const viewJob = async (jobId) => {
    try {
      const response = await jobsAPI.getById(jobId);
      setSelectedJob(response.data.job);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load job details', 'error');
    }
  };

  // ─── APPLY FOR JOB ───────────────────────────────────────────
  const applyForJob = async (jobId) => {
    try {
      await applicationsAPI.apply({ jobId });
      showToast('✅ Application submitted successfully!', 'success');
      setSelectedJob(null);
      loadApplications();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to apply', 'error');
    }
  };

  // ─── TABS DATA ───────────────────────────────────────────────
  const tabs = [
    {
      id: 'browse',
      label: 'Browse Jobs',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      )
    },
    {
      id: 'applications',
      label: 'My Applications',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
      badge: applications.length
    }
  ];

  return (
    <div className="dashboard">
      <Sidebar user={user} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        
        {/* Browse Jobs Tab */}
        {activeTab === 'browse' && (
          <div className="tab-content active">
            <div className="page-header">
              <div>
                <h1>Browse Jobs</h1>
                <p>Find your next opportunity</p>
              </div>
            </div>

            {/* Search */}
            <form className="search-filters" onSubmit={handleSearch}>
              <input
                type="text"
                className="search-input"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search by title, company, or skills..."
              />
              <button type="submit" className="btn-secondary">Search</button>
            </form>

            {/* Jobs Grid */}
            <div className="content-grid">
              {loading ? (
                <div className="loading">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <div className="empty-state">No jobs found</div>
              ) : (
                jobs.map(job => (
                  <JobCard key={job._id} job={job} onView={() => viewJob(job._id)} />
                ))
              )}
            </div>
          </div>
        )}

        {/* My Applications Tab */}
        {activeTab === 'applications' && (
          <div className="tab-content active">
            <div className="page-header">
              <div>
                <h1>My Applications</h1>
                <p>Track your job applications</p>
              </div>
            </div>

            <div className="applications-list">
              {applications.length === 0 ? (
                <div className="empty-state">You haven't applied to any jobs yet</div>
              ) : (
                applications.map(app => (
                  <ApplicationCard key={app._id} application={app} />
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* Job Modal */}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={() => applyForJob(selectedJob._id)}
        />
      )}
    </div>
  );
};

export default UserDashboard;
