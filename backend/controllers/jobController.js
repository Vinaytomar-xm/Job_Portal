const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/jobs — public
exports.getJobs = asyncHandler(async (req, res) => {
  const { search, category, type, location, experience, page = 1, limit = 10 } = req.query;
  const filter = { isActive: true };

  if (search) {
    filter.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
      { location:    { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (category   && category   !== 'All') filter.category   = category;
  if (type       && type       !== 'All') filter.type       = type;
  if (location   && location   !== 'All') filter.location   = { $regex: location, $options: 'i' };
  if (experience && experience !== 'All') filter.experience = experience;

  const skip  = (parseInt(page) - 1) * parseInt(limit);
  const total = await Job.countDocuments(filter);
  const jobs  = await Job.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  res.json({ jobs, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// GET /api/jobs/featured — public
exports.getFeatured = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .select('title companyName location type salary category companyLogo createdAt');
  res.json({ jobs });
});

// GET /api/jobs/my-jobs — company
exports.getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
  res.json({ jobs });
});

// GET /api/jobs/:id — public
exports.getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json({ job });
});

// POST /api/jobs — company
exports.createJob = asyncHandler(async (req, res) => {
  const { title, description, requirements, location, type, category,
    salary, experience, skills, openings, deadline } = req.body;

  const job = await Job.create({
    title, description, requirements, location,
    type:     type     || 'Full-Time',
    category: category || 'Other',
    salary, experience, skills,
    openings: openings || 1,
    deadline,
    postedBy:    req.user._id,
    companyName: req.user.companyName || req.user.name,
    companyLogo: req.user.companyLogo || '',
    isActive: true,
  });

  res.status(201).json({ job, message: 'Job posted successfully' });
});

// PUT /api/jobs/:id — company
exports.updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized to edit this job' });

  const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  res.json({ job: updated, message: 'Job updated successfully' });
});

// DELETE /api/jobs/:id — company
exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized to delete this job' });

  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: 'Job deleted successfully' });
});