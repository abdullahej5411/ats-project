// models/Interview.js — Interview Schedule Schema

const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({

  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },

  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },

  scheduledDate: {
    type: Date,
    required: [true, 'Interview date is required']
  },

  scheduledTime: {
    type: String,
    required: [true, 'Interview time is required']
    // e.g. '10:00 AM', '2:30 PM'
  },

  type: {
    type: String,
    enum: ['In-Person', 'Video Call', 'Phone'],
    default: 'Video Call'
  },

  location: {
    type: String,
    default: ''
    // For in-person: office address
    // For video: Zoom/Meet link
  },

  messageToCandidate: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },

  scheduledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, { timestamps: true });

module.exports = mongoose.model('Interview', InterviewSchema);
