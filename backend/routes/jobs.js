const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, restrictTo } = require('../middleware/auth');

// ── GET /api/jobs  (PUBLIC - browse/search/filter)
router.get('/', async (req, res) => {
  try {
    const { search, category, type, location, experience, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') filter.category = category;
    if (type && type !== 'All') filter.type = type;
    if (location && location !== 'All') filter.location = { $regex: location, $options: 'i' };
    if (experience && experience !== 'All') filter.experience = experience;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    res.json({ jobs, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/jobs/featured  (PUBLIC - latest 6 for homepage)
router.get('/featured', async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('title companyName location type salary category companyLogo createdAt');
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/jobs/my-jobs  (COMPANY - their own jobs)
router.get('/my-jobs', protect, restrictTo('company', 'admin'), async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/jobs/:id  (PUBLIC)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/jobs  (COMPANY only)
router.post('/', protect, restrictTo('company', 'admin'), async (req, res) => {
  try {
    const { title, description, requirements, location, type, category,
      salary, experience, skills, openings, deadline } = req.body;

    const job = await Job.create({
      title, description, requirements, location,
      type: type || 'Full-Time',
      category: category || 'Other',
      salary, experience, skills,
      openings: openings || 1,
      deadline,
      postedBy: req.user._id,
      companyName: req.user.companyName || req.user.name,
      companyLogo: req.user.companyLogo || '',
      isActive: true,
    });

    res.status(201).json({ job, message: 'Job posted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/jobs/:id  (COMPANY - own job only)
router.put('/:id', protect, restrictTo('company', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized to edit this job' });

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    res.json({ job: updated, message: 'Job updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/jobs/:id  (COMPANY - own job only)
router.delete('/:id', protect, restrictTo('company', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized to delete this job' });

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
