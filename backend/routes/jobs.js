const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

// ─── GET ALL JOBS (PUBLIC) ───────────────────────────────────────
// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const { keyword, location, type, experience, page = 1, limit = 10 } = req.query;

    // Build query
    let query = { status: 'active' };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { skills: { $in: [new RegExp(keyword, 'i')] } }
      ];
    }

    if (location && location !== 'all') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (experience && experience !== 'all') {
      query.experience = { $regex: experience, $options: 'i' };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Failed to fetch jobs',
      error: error.message
    });
  }
});

// ─── GET SINGLE JOB ──────────────────────────────────────────────
// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: '❌ Job not found'
      });
    }

    res.status(200).json({
      success: true,
      job
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Failed to fetch job',
      error: error.message
    });
  }
});

// ─── CREATE JOB (ADMIN ONLY) ─────────────────────────────────────
// POST /api/jobs
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      createdBy: req.user._id
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: '✅ Job created successfully',
      job
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Failed to create job',
      error: error.message
    });
  }
});

// ─── UPDATE JOB (ADMIN ONLY) ─────────────────────────────────────
// PUT /api/jobs/:id
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: '❌ Job not found'
      });
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: '✅ Job updated successfully',
      job: updatedJob
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Failed to update job',
      error: error.message
    });
  }
});

// ─── DELETE JOB (ADMIN ONLY) ─────────────────────────────────────
// DELETE /api/jobs/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: '❌ Job not found'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: '✅ Job deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Failed to delete job',
      error: error.message
    });
  }
});

module.exports = router;
