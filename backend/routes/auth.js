const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ── Cookie options ────────────────────────────────────────────────
const COOKIE_NAME = 'jb_token';

const cookieOptions = () => ({
  httpOnly: true,                          // JS can't read it — XSS safe
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,     // 7 days in ms
  path: '/',
});

const clearCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
});

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

const sendAuthResponse = (res, statusCode, user, message = '') => {
  const token = signToken(user._id);

  // Set httpOnly cookie
  res.cookie(COOKIE_NAME, token, cookieOptions());

  // Return user info (NO token in body — stays in cookie only)
  res.status(statusCode).json({
    message,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
    },
  });
};

// ── POST /api/auth/register  (job seeker) ─────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone, role: 'user' });
    sendAuthResponse(res, 201, user, 'Account created successfully');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/company-register  (recruiter) ──────────────────
router.post('/company-register', async (req, res) => {
  try {
    const { name, email, password, companyName, companyWebsite, companySize, companyDescription } = req.body;
    if (!name || !email || !password || !companyName)
      return res.status(400).json({ message: 'All required fields must be filled' });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name, email, password, role: 'company',
      companyName, companyWebsite, companySize, companyDescription,
    });
    sendAuthResponse(res, 201, user, 'Company registered successfully');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/login  (all roles) ─────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    sendAuthResponse(res, 200, user, 'Login successful');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, clearCookieOptions());
  res.json({ message: 'Logged out successfully' });
});

// ── GET /api/auth/me  (verify session) ────────────────────────────
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
