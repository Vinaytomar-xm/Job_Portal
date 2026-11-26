const express = require('express');
const router  = express.Router();
const {
  register, companyRegister, login, logout, getMe,
  forgotPassword, verifyOtp, resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register',         register);
router.post('/company-register', companyRegister);
router.post('/login',            login);
router.post('/logout',           logout);
router.get('/me',  protect,      getMe);

// Password reset flow
router.post('/forgot-password',  forgotPassword);
router.post('/verify-otp',       verifyOtp);
router.post('/reset-password',   resetPassword);

module.exports = router;