const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getUsers, 
  toggleBlockUser 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/block', toggleBlockUser);

module.exports = router;
