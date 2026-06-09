import axios from 'axios';

// ─── API CONFIGURATION ───────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── REQUEST INTERCEPTOR (ADD TOKEN) ─────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('job_portal_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── RESPONSE INTERCEPTOR (HANDLE ERRORS) ────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('job_portal_token');
      localStorage.removeItem('job_portal_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── AUTH API ────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── JOBS API ────────────────────────────────────────────────────
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// ─── APPLICATIONS API ────────────────────────────────────────────
export const applicationsAPI = {
  apply: (data) => api.post('/applications', data),
  getMy: () => api.get('/applications/my'),
  getAll: (params) => api.get('/applications', { params }),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
  delete: (id) => api.delete(`/applications/${id}`),
};

export default api;
