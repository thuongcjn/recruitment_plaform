const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// All AI routes are protected
router.post('/chat', protect, chatWithAI);

module.exports = router;
