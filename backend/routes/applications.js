const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, restrictTo } = require('../middleware/auth');
const { sendStatusUpdateEmail } = require('../utils/email');

// ── POST /api/applications/:jobId/apply  (USER - apply to job)
router.post('/:jobId/apply', protect, restrictTo('user'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!job.isActive) return res.status(400).json({ message: 'This job is no longer accepting applications' });

    // Check duplicate
    const existing = await Application.findOne({ job: job._id, applicant: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already applied for this job' });

    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      company: job.postedBy,
      coverLetter: req.body.coverLetter || '',
      resumeUrl: req.body.resumeUrl || req.user.resumeUrl || '',
      status: 'pending',
    });

    // Increment applications count on job
    await Job.findByIdAndUpdate(job._id, { $inc: { applicationsCount: 1 } });

    await application.populate([
      { path: 'job', select: 'title companyName location type' },
      { path: 'applicant', select: 'name email' },
    ]);

    res.status(201).json({ application, message: 'Application submitted successfully!' });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'You have already applied for this job' });
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/applications/my-applications  (USER - own applications)
router.get('/my-applications', protect, restrictTo('user'), async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title companyName location type salary category companyLogo isActive')
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/applications/company-applications  (COMPANY - all apps for their jobs)
router.get('/company-applications', protect, restrictTo('company', 'admin'), async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { company: req.user._id };
    const { jobId, status } = req.query;
    if (jobId) filter.job = jobId;
    if (status && status !== 'All') filter.status = status;

    const applications = await Application.find(filter)
      .populate('job', 'title location type category')
      .populate('applicant', 'name email phone resumeUrl')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/applications/:id/status  (COMPANY - update status & send email)
router.put('/:id/status', protect, restrictTo('company', 'admin'), async (req, res) => {
  try {
    const { status, companyNote } = req.body;
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    const application = await Application.findById(req.params.id)
      .populate('job', 'title companyName location')
      .populate('applicant', 'name email');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Verify company owns this application
    if (req.user.role !== 'admin' && application.company.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const oldStatus = application.status;
    application.status = status;
    if (companyNote !== undefined) application.companyNote = companyNote;
    await application.save();

    // ── SEND EMAIL if status changed & email not already sent for this status ──
    if (oldStatus !== status && application.emailSentFor !== status) {
      application.emailSentFor = status;
      await application.save();

      await sendStatusUpdateEmail({
        toEmail: application.applicant.email,
        toName: application.applicant.name,
        jobTitle: application.job.title,
        companyName: application.job.companyName,
        status,
      });
    }

    res.json({ application, message: `Application marked as ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/applications/check/:jobId  (USER - check if already applied)
router.get('/check/:jobId', protect, restrictTo('user'), async (req, res) => {
  try {
    const application = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });
    res.json({ applied: !!application, application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
