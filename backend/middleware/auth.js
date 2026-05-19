// middleware/auth.js — JWT Authentication Middleware
// Protects routes that require login.
// Usage: router.get('/protected', protect, controller)
// Usage: router.get('/hr-only', protect, authorizeHR, controller)

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── protect: verify JWT token ───────────────────────────────
const protect = async (req, res, next) => {
  let token;

  // Token comes in Authorization header as: Bearer <token>
  if (req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.'
    });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired'
    });
  }
};

// ── authorizeHR: allow only HR/admin users ──────────────────
const authorizeHR = (req, res, next) => {
  if (req.user && req.user.role === 'hr') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. HR role required.'
    });
  }
};

// ── authorizeCandidate: allow only candidates ───────────────
const authorizeCandidate = (req, res, next) => {
  if (req.user && req.user.role === 'candidate') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Candidate role required.'
    });
  }
};

module.exports = { protect, authorizeHR, authorizeCandidate };
