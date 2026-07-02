const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = 'jb_token';

// ── protect: must be logged in ────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    // 1. Try httpOnly cookie first (preferred)
    let token = req.cookies?.[COOKIE_NAME];

    // 2. Fallback: Authorization header (for API clients / Postman)
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token)
      return res.status(401).json({ message: 'Not authorized — please log in' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user)
      return res.status(401).json({ message: 'User not found' });

    next();
  } catch (err) {
    res.status(401).json({ message: 'Session expired — please log in again' });
  }
};

// ── restrictTo: role guard ─────────────────────────────────────────
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: `Access denied. Required: ${roles.join(' or ')}` });
  next();
};

module.exports = { protect, restrictTo };
