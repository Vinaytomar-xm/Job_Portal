const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User   = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendAuthResponse, COOKIE_NAME, clearCookieOptions } = require('../utils/cookieOptions');
const { sendOtpEmail } = require('../utils/email');

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email and password are required' });
  if (await User.findOne({ email }))
    return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password, phone, role: 'user' });
  sendAuthResponse(res, 201, user, 'Account created successfully');
});

// POST /api/auth/company-register
exports.companyRegister = asyncHandler(async (req, res) => {
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
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });
  sendAuthResponse(res, 200, user, 'Login successful');
});

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, clearCookieOptions());
  res.json({ message: 'Logged out successfully' });
};

// GET /api/auth/me
exports.getMe = (req, res) => {
  res.json({ user: req.user });
};

// ── FORGOT PASSWORD ───────────────────────────────────────────────
// POST /api/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  // Security: same response whether email exists or not (prevents enumeration)
  if (!user)
    return res.json({ message: 'If this email is registered, an OTP has been sent.' });

  // Generate 6-digit OTP
  const otp    = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Hash OTP before storing (security — plain OTP never in DB)
  const salt      = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, salt);

  user.resetOtp         = hashedOtp;
  user.resetOtpExpiry   = expiry;
  user.resetOtpVerified = false;
  await user.save({ validateBeforeSave: false });

  // Send OTP email
  await sendOtpEmail({ toEmail: user.email, toName: user.name, otp });

  res.json({ message: 'If this email is registered, an OTP has been sent.' });
});

// ── VERIFY OTP ────────────────────────────────────────────────────
// POST /api/auth/verify-otp
exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: 'Email and OTP are required' });

  const user = await User.findOne({ email })
    .select('+resetOtp +resetOtpExpiry +resetOtpVerified');

  if (!user || !user.resetOtp)
    return res.status(400).json({ message: 'Invalid or expired OTP' });

  // Check expiry
  if (user.resetOtpExpiry < new Date())
    return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });

  // Compare hashed OTP
  const isMatch = await bcrypt.compare(otp, user.resetOtp);
  if (!isMatch)
    return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });

  // Mark as verified
  user.resetOtpVerified = true;
  await user.save({ validateBeforeSave: false });

  res.json({ message: 'OTP verified successfully', verified: true });
});

// ── RESET PASSWORD ────────────────────────────────────────────────
// POST /api/auth/reset-password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword)
    return res.status(400).json({ message: 'All fields are required' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });

  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const user = await User.findOne({ email })
    .select('+resetOtp +resetOtpExpiry +resetOtpVerified');

  if (!user || !user.resetOtpVerified)
    return res.status(400).json({ message: 'Please verify your OTP first' });

  // Check expiry again (double check)
  if (user.resetOtpExpiry < new Date())
    return res.status(400).json({ message: 'OTP expired. Please start over.' });

  // Update password — pre-save hook will hash it
  user.password         = password;
  user.resetOtp         = undefined;
  user.resetOtpExpiry   = undefined;
  user.resetOtpVerified = undefined;
  await user.save();

  res.json({ message: 'Password reset successfully. Please log in.' });
});