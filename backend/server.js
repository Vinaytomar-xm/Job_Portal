require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// ─── INITIALIZE APP ──────────────────────────────────────────────
const app = express();

// ─── CONNECT TO DATABASE ─────────────────────────────────────────
connectDB();

// ─── MIDDLEWARE ──────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── ROUTES ──────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));

// ─── ROOT ROUTE ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Job Portal API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      applications: '/api/applications'
    },
    documentation: {
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
      getMe: 'GET /api/auth/me',
      getJobs: 'GET /api/jobs',
      createJob: 'POST /api/jobs (Admin)',
      applyJob: 'POST /api/applications (User)',
      getMyApplications: 'GET /api/applications/my (User)',
      getAllApplications: 'GET /api/applications (Admin)'
    }
  });
});

// ─── 404 HANDLER ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '❌ Route not found'
  });
});

// ─── ERROR HANDLER ───────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ─── START SERVER ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 Job Portal API Server Running!         ║
║                                               ║
║   📡 Port: ${PORT}                             ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}            ║
║   📝 API Docs: http://localhost:${PORT}        ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `);
});

module.exports = app;
