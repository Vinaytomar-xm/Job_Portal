const express = require('express');
const router  = express.Router();
const { applyToJob, getMyApplications, getCompanyApplications, updateStatus, checkApplied } = require('../controllers/applicationController');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/:jobId/apply',        protect, restrictTo('user'),             applyToJob);
router.get('/my-applications',      protect, restrictTo('user'),             getMyApplications);
router.get('/company-applications', protect, restrictTo('company', 'admin'), getCompanyApplications);
router.put('/:id/status',           protect, restrictTo('company', 'admin'), updateStatus);
router.get('/check/:jobId',         protect, restrictTo('user'),             checkApplied);

module.exports = router;