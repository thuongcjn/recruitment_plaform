const express = require('express');
const router = express.Router();
const { 
  createReport, 
  getReports, 
  deleteReport, 
  deleteJobByAdmin 
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // All report routes require protection

router.post('/', createReport);

// Admin only routes
router.get('/', authorize('admin'), getReports);
router.delete('/:id', authorize('admin'), deleteReport);
router.delete('/job/:jobId', authorize('admin'), deleteJobByAdmin);

module.exports = router;
