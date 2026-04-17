const express = require('express');
const router = express.Router();
const { 
  applyToJob, 
  getMyApplications, 
  getJobApplications, 
  updateApplicationStatus 
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/apply', authorize('candidate'), applyToJob);
router.get('/my', authorize('candidate'), getMyApplications);
router.get('/job/:jobId', authorize('recruiter'), getJobApplications);
router.put('/:id/status', authorize('recruiter'), updateApplicationStatus);

module.exports = router;
