const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// ── POST /api/auth/register   (job seeker)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone, role: 'user' });
    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/company-register  (company/recruiter)
router.post('/company-register', async (req, res) => {
  try {
    const { name, email, password, companyName, companyWebsite, companySize, companyDescription } = req.body;
    if (!name || !email || !password || !companyName)
      return res.status(400).json({ message: 'All required fields must be filled' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name, email, password,
      role: 'company',
      companyName, companyWebsite, companySize, companyDescription,
    });
    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: {
        _id: user._id, name: user.name, email: user.email,
        role: user.role, companyName: user.companyName,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/login  (all roles)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = signToken(user._id);
    res.json({
      token,
      user: {
        _id: user._id, name: user.name, email: user.email,
        role: user.role, companyName: user.companyName,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
