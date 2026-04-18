const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      role
    });

    if (user) {
      await sendTokenResponse(user, 201, res);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Check if user is blocked
      if (user.isBlocked) {
        return res.status(403).json({ 
          message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ support@hiretify.com để biết thêm chi tiết.' 
        });
      }
      await sendTokenResponse(user, 200, res);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        candidateProfile: user.candidateProfile,
        companyProfile: user.companyProfile
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookies
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  // Remove refresh token from DB
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

  res.cookie('accessToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: 'User logged out' });
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
exports.refresh = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Check if user is blocked during refresh
    if (user.isBlocked) {
      return res.status(403).json({ 
        message: 'Tài khoản của bạn đã bị khóa.' 
      });
    }

    await sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
  // Create tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('accessToken', accessToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
    })
    .cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })
    .json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
};

// Generate Access Token
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE
  });
};
