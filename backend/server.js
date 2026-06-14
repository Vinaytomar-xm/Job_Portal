require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ── Database ──
connectDB();

// ── Middleware ──
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ──
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));

// ── Health check ──
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'JobBoard API running ✅' }));

// ── 404 ──
app.use('*', (req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
