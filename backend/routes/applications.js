const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

// ─── APPLY FOR A JOB (USER ONLY) ────────────────────────────────
// POST /api/applications
router.post('/', protect, authorize('user'), async (req, res) => {
  try {
    const { jobId, coverLetter, resume } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: '❌ Job not found'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      user: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: '❌ You have already applied for this job'
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      user: req.user._id,
      coverLetter,
      resume
    });

    // Increment applications count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    });

    res.status(201).json({
      success: true,
      message: '✅ Application submitted successfully',
      application
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: '❌ You have already applied for this job'
      });
    }
    
    res.status(500).json({
      success: false,
      message: '❌ Failed to submit application',
      error: error.message
    });
  }
});

// ─── GET USER'S APPLICATIONS (USER) ──────────────────────────────
// GET /api/applications/my
router.get('/my', protect, authorize('user'), async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('job', 'title company location type salary')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Failed to fetch applications',
      error: error.message
    });
  }
});

// ─── GET ALL APPLICATIONS (ADMIN) ────────────────────────────────
// GET /api/applications
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, jobId, page = 1, limit = 20 } = req.query;

    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (jobId) {
      query.job = jobId;
    }

    const skip = (page - 1) * limit;

    const applications = await Application.find(query)
      .populate('user', 'name email phone')
      .populate('job', 'title company location type')
      .sort({ appliedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      applications
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Failed to fetch applications',
      error: error.message
    });
  }
});

// ─── GET SINGLE APPLICATION (ADMIN) ──────────────────────────────
// GET /api/applications/:id
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('job', 'title company location type salary description');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: '❌ Application not found'
      });
    }

    res.status(200).json({
      success: true,
      application
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Failed to fetch application',
      error: error.message
    });
  }
});

// ─── UPDATE APPLICATION STATUS (ADMIN) ───────────────────────────
// PUT /api/applications/:id/status
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email')
     .populate('job', 'title company');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: '❌ Application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: '✅ Application status updated',
      application
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Failed to update application status',
      error: error.message
    });
  }
});

// ─── DELETE APPLICATION (ADMIN) ──────────────────────────────────
// DELETE /api/applications/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: '❌ Application not found'
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: '✅ Application deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Failed to delete application',
      error: error.message
    });
  }
});

module.exports = router;
