const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  requirements: { type: String },
  location: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Remote', 'Freelance', 'Contract'],
    default: 'Full-Time',
  },
  category: {
    type: String,
    enum: ['Technology', 'Marketing', 'Design', 'Finance', 'Sales', 'HR', 'Operations', 'Other'],
    default: 'Other',
  },
  salary: {
    type: String,
    trim: true,
    default: 'Not Disclosed',
  },
  experience: {
    type: String,
    enum: ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years'],
    default: 'Fresher',
  },
  skills: [{ type: String, trim: true }],
  openings: { type: Number, default: 1 },
  deadline: { type: Date },
  isActive: { type: Boolean, default: true },

  // Company who posted this job
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: { type: String, required: true },
  companyLogo: { type: String },

  applicationsCount: { type: Number, default: 0 },
}, { timestamps: true });

// Text index for search
jobSchema.index({ title: 'text', description: 'text', companyName: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
