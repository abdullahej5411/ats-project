// controllers/authController.js — Auth Controller
// Handles: Register, Login, Get Profile, Update Profile, Upload Profile Pic

const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// ── Helper: send token response ──────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:           user._id,
      name:          user.name,
      email:         user.email,
      role:          user.role,
      profilePicUrl: user.profilePicUrl,
      phone:         user.phone,
      skills:        user.skills,
      education:     user.education,
      experience:    user.experience,
      linkedIn:      user.linkedIn,
      portfolio:     user.portfolio
    }
  });
};

// ── POST /api/auth/register ──────────────────────────────────
const register = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  // Check if email already exists
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // HR registration requires a secret code (basic protection)
  if (role === 'hr') {
    if (req.body.hrCode !== process.env.HR_SECRET_CODE) {
      return res.status(403).json({
        success: false,
        message: 'Invalid HR registration code'
      });
    }
  }

  const user = await User.create({ name, email, password,
    role: role || 'candidate', phone });

  sendTokenResponse(user, 201, res);
};

// ── POST /api/auth/login ─────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Include password in query (normally excluded by select: false)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  sendTokenResponse(user, 200, res);
};

// ── GET /api/auth/me ─────────────────────────────────────────
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('branch');
  res.status(200).json({ success: true, user });
};

// ── PUT /api/auth/profile ────────────────────────────────────
const updateProfile = async (req, res) => {
  const { name, phone, skills, education,
          experience, linkedIn, portfolio } = req.body;

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, skills, education, experience, linkedIn, portfolio },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, user: updated });
};

// ── PUT /api/auth/profile-pic ────────────────────────────────
// Cloudinary upload handled by multer middleware in route
const updateProfilePic = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image uploaded'
    });
  }

  // req.file.path contains the Cloudinary URL
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePicUrl: req.file.path },
    { new: true }
  );

  res.status(200).json({
    success: true,
    profilePicUrl: user.profilePicUrl
  });
};

// ── PUT /api/auth/change-password ────────────────────────────
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updateProfilePic,
  changePassword
};
