// models/Application.js — Job Application Schema
// Stores Cloudinary URLs for files — never stores files locally

const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },

  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // ── Uploaded Files (Cloudinary URLs) ────────────────────
  resumeUrl: {
    type: String,
    required: [true, 'Resume is required']
    // This is the Cloudinary URL, e.g.:
    // https://res.cloudinary.com/yourcloud/raw/upload/ats/documents/resume.pdf
  },

  coverLetterUrl: {
    type: String,
    default: ''
    // Optional cover letter — Cloudinary URL
  },

  // ── Application Status Pipeline ─────────────────────────
  status: {
    type: String,
    enum: [
      'Submitted',
      'Under Review',
      'Shortlisted',
      'Interview Scheduled',
      'Rejected',
      'Selected'
    ],
    default: 'Submitted'
  },

  // ── HR Notes (internal) ──────────────────────────────────
  hrNotes: {
    type: String,
    default: ''
  },

  // ── Interview reference (filled when interview scheduled) ─
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    default: null
  }

}, { timestamps: true });

// Prevent duplicate applications (one per candidate per job)
ApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
