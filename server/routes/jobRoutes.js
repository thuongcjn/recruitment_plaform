const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getMyJobs,
  getRecruiterStats
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// 1. Specific Public Routes
router.get('/', getJobs);

// 2. Protected Routes (Require login)
router.use(protect);

// 3. Specific Protected Routes (Must be BEFORE routes with :id params)
router.get('/my/all', authorize('recruiter'), getMyJobs);
router.get('/stats', authorize('recruiter'), getRecruiterStats);

// 4. Parameterized Routes (Always at the end to avoid conflicts)
router.get('/:id', getJob); // Moved down here
router.post('/', authorize('recruiter'), createJob);
router.put('/:id', authorize('recruiter'), updateJob);
router.delete('/:id', authorize('recruiter'), deleteJob);

module.exports = router;
