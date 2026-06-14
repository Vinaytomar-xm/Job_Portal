import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data);
export const registerCompany = (data) => api.post('/auth/company-register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// ── Jobs ──────────────────────────────────────
export const getJobs = (params) => api.get('/jobs', { params });
export const getFeatured = () => api.get('/jobs/featured');
export const getJob = (id) => api.get(`/jobs/${id}`);
export const getMyJobs = () => api.get('/jobs/my-jobs');
export const createJob = (data) => api.post('/jobs', data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// ── Applications ──────────────────────────────
export const applyToJob = (jobId, data) => api.post(`/applications/${jobId}/apply`, data);
export const checkApplied = (jobId) => api.get(`/applications/check/${jobId}`);
export const getMyApplications = () => api.get('/applications/my-applications');
export const getCompanyApps = (params) => api.get('/applications/company-applications', { params });
export const updateAppStatus = (id, data) => api.put(`/applications/${id}/status`, data);

export default api;
