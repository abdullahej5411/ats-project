// controllers/interviewController.js — Interview Controller
// HR: schedule, update, cancel interviews
// Candidate: view their scheduled interviews

const Interview   = require('../models/Interview');
const Application = require('../models/Application');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// ── POST /api/interviews — HR schedules an interview ─────────
const scheduleInterview = async (req, res) => {
  const {
    applicationId, scheduledDate, scheduledTime,
    type, location, messageToCandidate
  } = req.body;

  const application = await Application.findById(applicationId)
    .populate('candidate', 'name email')
    .populate('job', 'title');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  // Create the interview record
  const interview = await Interview.create({
    application:         applicationId,
    candidate:           application.candidate._id,
    job:                 application.job._id,
    scheduledDate,
    scheduledTime,
    type:                type || 'Video Call',
    location:            location || '',
    messageToCandidate:  messageToCandidate || '',
    scheduledBy:         req.user._id
  });

  // Update application status and link interview
  await Application.findByIdAndUpdate(applicationId, {
    status:    'Interview Scheduled',
    interview: interview._id
  });

  // Send email to candidate
  try {
    const { name, email } = application.candidate;
    const emailData = emailTemplates.interviewScheduled(
      name, application.job.title,
      new Date(scheduledDate).toDateString(),
      scheduledTime, type, location, messageToCandidate
    );
    await sendEmail({ to: email, ...emailData });
  } catch (err) {
    console.error('Interview email error:', err.message);
  }

  res.status(201).json({ success: true, interview });
};

// ── GET /api/interviews — HR gets all interviews ─────────────
const getAllInterviews = async (req, res) => {
  const interviews = await Interview.find()
    .populate('candidate', 'name email phone')
    .populate('job', 'title department')
    .populate({ path: 'job', populate: { path: 'branch', select: 'name city' } })
    .sort({ scheduledDate: 1 });

  res.status(200).json({ success: true, count: interviews.length, interviews });
};

// ── GET /api/interviews/my — candidate views their interviews ─
const getMyInterviews = async (req, res) => {
  const interviews = await Interview.find({ candidate: req.user._id })
    .populate('job', 'title department')
    .populate({ path: 'job', populate: { path: 'branch', select: 'name city' } })
    .sort({ scheduledDate: 1 });

  res.status(200).json({ success: true, interviews });
};

// ── PUT /api/interviews/:id — HR updates interview ────────────
const updateInterview = async (req, res) => {
  const interview = await Interview.findByIdAndUpdate(
    req.params.id, req.body, { new: true }
  ).populate('candidate', 'name email')
   .populate('job', 'title');

  if (!interview) {
    return res.status(404).json({ success: false, message: 'Interview not found' });
  }

  res.status(200).json({ success: true, interview });
};

// ── PUT /api/interviews/:id/cancel — HR cancels interview ─────
const cancelInterview = async (req, res) => {
  const interview = await Interview.findByIdAndUpdate(
    req.params.id, { status: 'Cancelled' }, { new: true }
  );

  if (!interview) {
    return res.status(404).json({ success: false, message: 'Interview not found' });
  }

  // Revert application status back to Shortlisted
  await Application.findByIdAndUpdate(interview.application, {
    status: 'Shortlisted'
  });

  res.status(200).json({ success: true, message: 'Interview cancelled' });
};

module.exports = {
  scheduleInterview, getAllInterviews, getMyInterviews,
  updateInterview, cancelInterview
};
