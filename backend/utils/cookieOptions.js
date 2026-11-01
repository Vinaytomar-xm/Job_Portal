const COOKIE_NAME = 'jb_token';

const cookieOptions = () => ({
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
  path:     '/',
});

const clearCookieOptions = () => ({
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path:     '/',
});

const sendAuthResponse = (res, statusCode, user, message = '') => {
  const generateToken = require('./generateToken');
  const token = generateToken(user._id);
  res.cookie(COOKIE_NAME, token, cookieOptions());
  res.status(statusCode).json({
    message,
    user: {
      _id:         user._id,
      name:        user.name,
      email:       user.email,
      role:        user.role,
      companyName: user.companyName,
    },
  });
};

module.exports = { COOKIE_NAME, cookieOptions, clearCookieOptions, sendAuthResponse };