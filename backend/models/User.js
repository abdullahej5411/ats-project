// models/User.js — User Schema
// Covers both Candidates and HR admins (role field distinguishes them)

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({

  // ── Basic Info ───────────────────────────────────────────
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false   // never return password in queries
  },

  role: {
    type: String,
    enum: ['candidate', 'hr'],
    default: 'candidate'
  },

  // ── Candidate Profile ────────────────────────────────────
  phone: { type: String, trim: true },

  profilePicUrl: { type: String, default: '' },

  skills: [{ type: String }],

  education: {
    degree:      { type: String },
    institution: { type: String },
    year:        { type: Number }
  },

  experience: {
    years:   { type: Number, default: 0 },
    summary: { type: String }
  },

  linkedIn: { type: String },
  portfolio: { type: String },

  // ── HR Info ──────────────────────────────────────────────
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },

  isActive: { type: Boolean, default: true }

}, { timestamps: true });

// ── Hash password before saving ──────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt   = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Compare entered password with hashed password ────────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ── Generate JWT token ───────────────────────────────────────
UserSchema.methods.getSignedToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

module.exports = mongoose.model('User', UserSchema);
