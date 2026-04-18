const User = require('../models/User');
const Job = require('../models/Job');
const Report = require('../models/Report');
const Application = require('../models/Application');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalApplications = await Application.countDocuments();

    const candidatesCount = await User.countDocuments({ role: 'candidate' });
    const recruitersCount = await User.countDocuments({ role: 'recruiter' });

    // Last 5 reports
    const latestReports = await Report.find()
      .populate('jobId', 'title')
      .populate('reporterId', 'fullName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        totalReports,
        totalApplications,
        candidatesCount,
        recruitersCount
      },
      latestReports
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-refreshToken').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle block/unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow blocking yourself (admin)
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot block yourself' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
