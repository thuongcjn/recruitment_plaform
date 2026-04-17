const User = require('../models/User');

// @desc    Update candidate profile
// @route   PUT /api/profile/candidate
// @access  Private (Candidate only)
exports.updateCandidateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can update candidate profiles' });
    }

    // Update fields explicitly to ensure Mongoose detects changes
    if (req.body.bio !== undefined) user.candidateProfile.bio = req.body.bio;
    if (req.body.skills !== undefined) user.candidateProfile.skills = req.body.skills;
    if (req.body.education !== undefined) user.candidateProfile.education = req.body.education;
    if (req.body.experience !== undefined) user.candidateProfile.experience = req.body.experience;
    if (req.body.resumeUrl !== undefined) user.candidateProfile.resumeUrl = req.body.resumeUrl;
    if (req.body.profilePicture !== undefined) user.candidateProfile.profilePicture = req.body.profilePicture;

    await user.save();

    res.json({
      success: true,
      message: 'Candidate profile updated',
      profile: user.candidateProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update company profile
// @route   PUT /api/profile/company
// @access  Private (Recruiter only)
exports.updateCompanyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can update company profiles' });
    }

    // Update fields explicitly
    if (req.body.companyName !== undefined) user.companyProfile.companyName = req.body.companyName;
    if (req.body.description !== undefined) user.companyProfile.description = req.body.description;
    if (req.body.website !== undefined) user.companyProfile.website = req.body.website;
    if (req.body.location !== undefined) user.companyProfile.location = req.body.location;
    if (req.body.logoUrl !== undefined) user.companyProfile.logoUrl = req.body.logoUrl;

    await user.save();

    res.json({
      success: true,
      message: 'Company profile updated',
      profile: user.companyProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public profile by user ID
// @route   GET /api/profile/:id
// @access  Public
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken -email');

    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload file
// @route   POST /api/profile/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      success: true,
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
