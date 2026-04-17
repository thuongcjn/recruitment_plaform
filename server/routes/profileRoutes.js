const express = require('express');
const router = express.Router();
const {
  updateCandidateProfile,
  updateCompanyProfile,
  getPublicProfile,
  uploadFile
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public profile access
router.get('/:id', getPublicProfile);

// Protected routes
router.use(protect);
router.put('/candidate', updateCandidateProfile);
router.put('/company', updateCompanyProfile);
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
