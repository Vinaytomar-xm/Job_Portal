const express = require('express');
const router  = express.Router();
const { getJobs, getFeatured, getMyJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/',         getJobs);
router.get('/featured', getFeatured);
router.get('/my-jobs',  protect, restrictTo('company', 'admin'), getMyJobs);
router.get('/:id',      getJob);
router.post('/',        protect, restrictTo('company', 'admin'), createJob);
router.put('/:id',      protect, restrictTo('company', 'admin'), updateJob);
router.delete('/:id',   protect, restrictTo('company', 'admin'), deleteJob);

module.exports = router;