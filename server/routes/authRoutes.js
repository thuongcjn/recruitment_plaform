const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  logout,
  refresh
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/profile', protect, getProfile);
router.get('/logout', protect, logout);

module.exports = router;
