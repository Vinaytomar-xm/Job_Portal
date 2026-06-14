const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  // 'user' = job seeker | 'company' = recruiter | 'admin' = super admin
  role: {
    type: String,
    enum: ['user', 'company', 'admin'],
    default: 'user',
  },

  // ── Company-specific fields ──
  companyName: { type: String, trim: true },
  companyWebsite: { type: String, trim: true },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+', ''],
    default: '',
  },
  companyDescription: { type: String, trim: true },
  companyLogo: { type: String, trim: true }, // URL or initials fallback

  // ── Job-seeker fields ──
  phone: { type: String, trim: true },
  resumeUrl: { type: String, trim: true },

  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
