// models/Job.js — Job Posting Schema

const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({

  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },

  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
    // e.g. 'Engineering', 'Design', 'Marketing', 'HR', 'Finance'
  },

  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: [true, 'Branch is required']
  },

  description: {
    type: String,
    required: [true, 'Job description is required']
  },

  requirements: {
    type: String,
    required: [true, 'Job requirements are required']
  },

  type: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'],
    default: 'Full-Time'
  },

  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [1, 'At least 1 seat required']
  },

  deadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },

  salaryRange: {
    min: { type: Number },
    max: { type: Number }
  },

  skills: [{ type: String }],

  isOpen: {
    type: Boolean,
    default: true
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
