const Application = require('../models/Application');
const Job = require('../models/Job');
const { sendNewApplicationEmail, sendStatusUpdateEmail } = require('../utils/emailService');

// Apply for a job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const candidateId = req.user.id;

    // Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ job: jobId, candidate: candidateId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    // Candidate must have a resume uploaded
    if (!req.user.candidateProfile?.resumeUrl) {
      return res.status(400).json({ success: false, message: 'Please upload your resume in your profile before applying' });
    }

    console.log('--- New Application Request ---');
    console.log('Job ID:', jobId);
    console.log('Candidate:', req.user.fullName);

    const application = await Application.create({
      job: jobId,
      candidate: candidateId,
      resume: req.user.candidateProfile.resumeUrl,
      coverLetter
    });

    console.log('✅ Application created in DB');

    // Increment applicantsCount in Job model
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });

    // Send notification email to recruiter
    const populatedJob = await Job.findById(jobId).populate('company', 'email');
    console.log('Populated Job Company:', populatedJob?.company);

    if (populatedJob && populatedJob.company && populatedJob.company.email) {
      console.log('Calling sendNewApplicationEmail...');
      await sendNewApplicationEmail(populatedJob.company.email, req.user.fullName, populatedJob.title);
    } else {
      console.warn('⚠️ Cannot send email: Recruiter email not found or Job not populated');
    }

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get my applications (Candidate)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'fullName companyProfile' }
      })
      .sort('-createdAt');

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get applications for a job (Recruiter)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify ownership of the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'fullName email candidateProfile')
      .sort('-createdAt');

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update application status (Recruiter)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id).populate('job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify ownership
    if (application.job.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedApplication = await Application.findByIdAndUpdate(req.params.id, { status }, {
      new: true,
      runValidators: true
    }).populate('candidate', 'fullName email').populate('job', 'title');

    // Send notification email to candidate
    if (updatedApplication && updatedApplication.candidate && updatedApplication.candidate.email) {
      await sendStatusUpdateEmail(
        updatedApplication.candidate.email, 
        updatedApplication.candidate.fullName, 
        updatedApplication.job.title, 
        status
      );
    }

    res.status(200).json({ success: true, data: updatedApplication });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
