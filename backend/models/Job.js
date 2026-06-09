const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
    default: 'Full-time'
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [20, 'Description must be at least 20 characters']
  },
  skills: {
    type: [String],
    default: []
  },
  responsibilities: {
    type: [String],
    default: []
  },
  requirements: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// ─── INDEX FOR FASTER SEARCH ─────────────────────────────────────
jobSchema.index({ title: 'text', company: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
