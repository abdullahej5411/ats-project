// controllers/applicationController.js — Application Controller
// Candidate: apply, view own applications
// HR: view all, update status, send emails

const Application = require('../models/Application');
const Job         = require('../models/Job');
const User        = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// ── POST /api/applications — candidate applies for a job ─────
const applyForJob = async (req, res) => {
  const { jobId } = req.body;

  // Check job exists and is open
  const job = await Job.findById(jobId);
  if (!job || !job.isOpen) {
    return res.status(400).json({
      success: false,
      message: 'Job not found or no longer accepting applications'
    });
  }

  // Check for duplicate application
  const existing = await Application.findOne({
    job: jobId,
    candidate: req.user._id
  });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'You have already applied for this job'
    });
  }

  // Cloudinary URLs come from multer middleware
  if (!req.files || !req.files.resume) {
    return res.status(400).json({
      success: false,
      message: 'Resume is required'
    });
  }

  const resumeUrl      = req.files.resume[0].path;
  const coverLetterUrl = req.files.coverLetter
    ? req.files.coverLetter[0].path : '';

  const application = await Application.create({
    job:           jobId,
    candidate:     req.user._id,
    resumeUrl,
    coverLetterUrl,
    status:        'Submitted'
  });

  res.status(201).json({ success: true, application });
};

// ── GET /api/applications/my — candidate views own apps ──────
const getMyApplications = async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate('job', 'title department branch deadline')
    .populate({ path: 'job', populate: { path: 'branch', select: 'name city' } })
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, applications });
};

// ── GET /api/applications — HR gets all applications ─────────
const getAllApplications = async (req, res) => {
  const { job, status, branch } = req.query;
  const query = {};
  if (status) query.status = status;
  if (job)    query.job    = job;

  const applications = await Application.find(query)
    .populate('candidate', 'name email phone profilePicUrl skills education experience')
    .populate({ path: 'job', select: 'title department branch',
                populate: { path: 'branch', select: 'name city' } })
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: applications.length, applications });
};

// ── GET /api/applications/:id — get single application ───────
const getApplication = async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('candidate', 'name email phone skills education experience linkedIn portfolio')
    .populate({ path: 'job', populate: { path: 'branch', select: 'name city' } })
    .populate('interview');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  // Candidates can only see their own applications
  if (req.user.role === 'candidate' &&
      application.candidate._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  res.status(200).json({ success: true, application });
};

// ── PUT /api/applications/:id/status — HR updates status ─────
const updateStatus = async (req, res) => {
  const { status, hrNotes } = req.body;

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { status, hrNotes },
    { new: true }
  ).populate('candidate', 'name email')
   .populate('job', 'title');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  // Auto-send email based on status change
  try {
    let emailData;
    const { name, email } = application.candidate;
    const jobTitle = application.job.title;

    if (status === 'Shortlisted') {
      emailData = emailTemplates.shortlisted(name, jobTitle);
    } else if (status === 'Rejected') {
      emailData = emailTemplates.rejected(name, jobTitle);
    } else if (status === 'Selected') {
      emailData = emailTemplates.selected(name, jobTitle);
    }

    if (emailData) {
      await sendEmail({ to: email, ...emailData });
    }
  } catch (emailErr) {
    console.error('Email send error:', emailErr.message);
    // Don't fail the request if email fails
  }

  res.status(200).json({ success: true, application });
};

// ── POST /api/applications/:id/email — HR sends custom email ─
const sendCustomEmail = async (req, res) => {
  const { subject, message } = req.body;

  const application = await Application.findById(req.params.id)
    .populate('candidate', 'name email');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  const { name, email } = application.candidate;
  const emailData = emailTemplates.custom(name, subject, message);
  await sendEmail({ to: email, ...emailData });

  res.status(200).json({ success: true, message: 'Email sent successfully' });
};

// ── GET /api/applications/stats — HR dashboard stats ─────────
const getStats = async (req, res) => {
  const total       = await Application.countDocuments();
  const submitted   = await Application.countDocuments({ status: 'Submitted' });
  const underReview = await Application.countDocuments({ status: 'Under Review' });
  const shortlisted = await Application.countDocuments({ status: 'Shortlisted' });
  const scheduled   = await Application.countDocuments({ status: 'Interview Scheduled' });
  const rejected    = await Application.countDocuments({ status: 'Rejected' });
  const selected    = await Application.countDocuments({ status: 'Selected' });

  res.status(200).json({
    success: true,
    stats: { total, submitted, underReview, shortlisted, scheduled, rejected, selected }
  });
};

module.exports = {
  applyForJob, getMyApplications, getAllApplications,
  getApplication, updateStatus, sendCustomEmail, getStats
};
