const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversations,
  getMessages,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/message', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/messages/:conversationId', protect, getMessages);

module.exports = router;
