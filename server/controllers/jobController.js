const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can post jobs' });
    }

    req.body.company = req.user._id;
    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs (with search and filters)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { keyword, location, type, category, company } = req.query;
    let query = { status: 'open' };

    if (company) {
      query.company = company;
    }

    if (keyword) {
      query.$text = { $search: keyword };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const jobs = await Job.find(query)
      .populate('company', 'fullName companyProfile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company', 'fullName companyProfile email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only, owner only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Make sure user is job owner
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter only, owner only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Make sure user is job owner
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job removed'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get jobs posted by current recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter only)
exports.getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can access this' });
    }

    const jobs = await Job.find({ company: req.user._id }).sort({ createdAt: -1 });

    // Calculate real applicant count for each job
    const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
      const count = await Application.countDocuments({ job: job._id });
      // Convert to plain object and update count
      const jobObj = job.toObject();
      jobObj.applicantsCount = count;
      return jobObj;
    }));

    res.status(200).json({
      success: true,
      count: jobsWithCounts.length,
      data: jobsWithCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recruiter dashboard stats
// @route   GET /api/jobs/stats
// @access  Private (Recruiter only)
exports.getRecruiterStats = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user._id });
    
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === 'open').length;
    
    // Count real applications
    const jobIds = jobs.map(j => j._id);
    const totalApplicants = await Application.countDocuments({ job: { $in: jobIds } });

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        totalApplicants
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
