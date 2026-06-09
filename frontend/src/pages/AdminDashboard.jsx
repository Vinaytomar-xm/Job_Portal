import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../services/api';
import { showToast } from '../components/Toast';
import Sidebar from '../components/Sidebar';
import JobCard from '../components/JobCard';
import JobFormModal from '../components/JobFormModal';
import ApplicationCard from '../components/ApplicationCard';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // ─── LOAD JOBS ───────────────────────────────────────────────
  const loadJobs = async () => {
    try {
      const response = await jobsAPI.getAll();
      setJobs(response.data.jobs || []);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load jobs', 'error');
    }
  };

  // ─── LOAD APPLICATIONS ───────────────────────────────────────
  const loadApplications = async () => {
    try {
      const response = await applicationsAPI.getAll();
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

  // ─── CREATE/UPDATE JOB ───────────────────────────────────────
  const handleSaveJob = async (jobData) => {
    try {
      if (editingJob) {
        await jobsAPI.update(editingJob._id, jobData);
        showToast('✅ Job updated successfully!', 'success');
      } else {
        await jobsAPI.create(jobData);
        showToast('✅ Job created successfully!', 'success');
      }
      setShowJobForm(false);
      setEditingJob(null);
      loadJobs();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save job', 'error');
    }
  };

  // ─── EDIT JOB ────────────────────────────────────────────────
  const handleEdit = (job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  // ─── DELETE JOB ──────────────────────────────────────────────
  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await jobsAPI.delete(jobId);
      showToast('✅ Job deleted successfully!', 'success');
      loadJobs();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete job', 'error');
    }
  };

  // ─── UPDATE APPLICATION STATUS ───────────────────────────────
  const handleStatusUpdate = async (appId, status) => {
    try {
      await applicationsAPI.updateStatus(appId, status);
      showToast('✅ Application status updated!', 'success');
      loadApplications();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  // ─── TABS DATA ───────────────────────────────────────────────
  const tabs = [
    {
      id: 'jobs',
      label: 'Manage Jobs',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      ),
      badge: jobs.length
    },
    {
      id: 'applications',
      label: 'Applications',
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
      <Sidebar user={user} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} isAdmin />

      <main className="main-content">
        
        {/* Manage Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="tab-content active">
            <div className="page-header">
              <div>
                <h1>Manage Jobs</h1>
                <p>Create, edit, and manage job postings</p>
              </div>
              <button className="btn-primary" onClick={() => setShowJobForm(true)}>
                + Post New Job
              </button>
            </div>

            <div className="content-grid">
              {jobs.length === 0 ? (
                <div className="empty-state">No jobs posted yet. Create your first job!</div>
              ) : (
                jobs.map(job => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isAdmin
                    onEdit={() => handleEdit(job)}
                    onDelete={() => handleDelete(job._id)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="tab-content active">
            <div className="page-header">
              <div>
                <h1>All Applications</h1>
                <p>Review and manage job applications</p>
              </div>
            </div>

            <div className="applications-list">
              {applications.length === 0 ? (
                <div className="empty-state">No applications received yet</div>
              ) : (
                applications.map(app => (
                  <ApplicationCard
                    key={app._id}
                    application={app}
                    isAdmin
                    onStatusUpdate={(status) => handleStatusUpdate(app._id, status)}
                  />
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* Job Form Modal */}
      {showJobForm && (
        <JobFormModal
          job={editingJob}
          onClose={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
          onSave={handleSaveJob}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
