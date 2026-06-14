const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'],
    default: 'pending',
  },
  coverLetter: { type: String, trim: true },
  resumeUrl: { type: String, trim: true },

  // Track email notifications sent
  emailSentFor: { type: String, default: '' },

  companyNote: { type: String, trim: true }, // internal note by company
}, { timestamps: true });

// One application per user per job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
