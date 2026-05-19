// models/Branch.js — Branch Schema
// Represents company branches: Islamabad, Lahore, Karachi, Remote

const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Branch name is required'],
    unique: true,
    trim: true
    // Examples: 'Islamabad', 'Lahore', 'Karachi', 'Remote'
  },

  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },

  address: {
    type: String,
    trim: true
  },

  contactEmail: {
    type: String,
    trim: true
  },

  contactPhone: {
    type: String
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Branch', BranchSchema);
