const Report = require('../models/Report');

// @desc    Report a job
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  try {
    const { jobId, reason } = req.body;
    const reporterId = req.user.id;

    const report = await Report.create({
      jobId,
      reporterId,
      reason,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private/Admin
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate({
        path: 'jobId',
        populate: {
          path: 'company',
          select: 'fullName companyProfile'
        }
      })
      .populate('reporterId', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a report (Dismiss)
// @route   DELETE /api/reports/:id
// @access  Private/Admin
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.deleteOne();
    res.status(200).json({ message: 'Report dismissed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job and all its reports
// @route   DELETE /api/reports/job/:jobId
// @access  Private/Admin
exports.deleteJobByAdmin = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Delete the job
    const Job = require('../models/Job');
    await Job.findByIdAndDelete(jobId);

    // Delete all reports for this job
    await Report.deleteMany({ jobId });

    res.status(200).json({ message: 'Job and associated reports deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
