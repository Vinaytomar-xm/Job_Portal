import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ── Global 401 handler ────────────────────────────────────────────
// IMPORTANT: Sirf protected API calls pe redirect karo
// getMe() bhi 401 deta hai agar logged out ho — usse redirect nahi karna
// isliye 'skipAuthRedirect' flag use karo
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const skip = err.config?._skipAuthRedirect;
    if (err.response?.status === 401 && !skip) {
      localStorage.removeItem('jb_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────────
export const registerUser    = (data) => api.post('/auth/register', data);
export const registerCompany = (data) => api.post('/auth/company-register', data);
export const loginUser       = (data) => api.post('/auth/login', data);
export const logoutUser      = ()     => api.post('/auth/logout');

// getMe — _skipAuthRedirect: true kyunki yeh public pages pe bhi call hota hai
// agar cookie nahi hai toh 401 aayega — that's fine, redirect mat karo
export const getMe = () => api.get('/auth/me', { _skipAuthRedirect: true });

// ── Jobs ─────────────────────────────────────────────────────────
export const getJobs     = (params)   => api.get('/jobs', { params });
export const getFeatured = ()         => api.get('/jobs/featured');
export const getJob      = (id)       => api.get(`/jobs/${id}`);
export const getMyJobs   = ()         => api.get('/jobs/my-jobs');
export const createJob   = (data)     => api.post('/jobs', data);
export const updateJob   = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob   = (id)       => api.delete(`/jobs/${id}`);

// ── Applications ─────────────────────────────────────────────────
export const applyToJob        = (jobId, data) => api.post(`/applications/${jobId}/apply`, data);
export const checkApplied      = (jobId)        => api.get(`/applications/check/${jobId}`);
export const getMyApplications = ()             => api.get('/applications/my-applications');
export const getCompanyApps    = (params)       => api.get('/applications/company-applications', { params });
export const updateAppStatus   = (id, data)     => api.put(`/applications/${id}/status`, data);

export default api;
