import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ── Global 401 handler ───────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // SIRF in routes pe 401 aane se logout karo
    // baaki jagah (checkApplied, getMe, public routes) pe ignore karo
    const PROTECTED_ROUTES = [
      '/applications/my-applications',
      '/applications/company-applications',
      '/jobs/my-jobs',
      '/company/post-job',
    ];

    const url = err.config?.url || '';
    const isProtected = PROTECTED_ROUTES.some(route => url.includes(route));

    if (err.response?.status === 401 && isProtected) {
      localStorage.removeItem('jb_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data);
export const registerCompany = (data) => api.post('/auth/company-register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const logoutUser = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me', { _skipAuthRedirect: true });

// ── Jobs ─────────────────────────────────────────────────────────
export const getJobs = (params) => api.get('/jobs', { params });
export const getFeatured = () => api.get('/jobs/featured');
export const getJob = (id) => api.get(`/jobs/${id}`);
export const getMyJobs = () => api.get('/jobs/my-jobs');
export const createJob = (data) => api.post('/jobs', data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// ── Applications ─────────────────────────────────────────────────
export const applyToJob = (jobId, data) => api.post(`/applications/${jobId}/apply`, data);
export const checkApplied = (jobId) => api.get(`/applications/check/${jobId}`, { _skipAuthRedirect: true });
export const getMyApplications = () => api.get('/applications/my-applications');
export const getCompanyApps = (params) => api.get('/applications/company-applications', { params });
export const updateAppStatus = (id, data) => api.put(`/applications/${id}/status`, data);

export default api;