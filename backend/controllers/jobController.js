// controllers/jobController.js — Job Controller
// Public: list jobs, filter, search, view detail
// HR: create, update, delete, toggle open/close

const Job = require('../models/Job');

// ── GET /api/jobs — get all open jobs with filters ───────────
const getJobs = async (req, res) => {
  const { branch, department, type, search, page = 1, limit = 10 } = req.query;

  const query = { isOpen: true };

  if (branch)     query.branch     = branch;
  if (department) query.department = department;
  if (type)       query.type       = type;
  if (search) {
    query.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { department:  { $regex: search, $options: 'i' } }
    ];
  }

  const total = await Job.countDocuments(query);
  const jobs  = await Job.find(query)
    .populate('branch', 'name city')
    .populate('postedBy', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: jobs.length,
    total,
    pages: Math.ceil(total / limit),
    jobs
  });
};

// ── GET /api/jobs/all — HR gets all jobs including closed ─────
const getAllJobsHR = async (req, res) => {
  const jobs = await Job.find()
    .populate('branch', 'name city')
    .populate('postedBy', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: jobs.length, jobs });
};

// ── GET /api/jobs/:id — get single job (public) ──────────────
const getJob = async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('branch', 'name city address contactEmail')
    .populate('postedBy', 'name');

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }
  res.status(200).json({ success: true, job });
};

// ── POST /api/jobs — create job (HR only) ────────────────────
const createJob = async (req, res) => {
  req.body.postedBy = req.user._id;
  const job = await Job.create(req.body);
  const populated = await job.populate('branch', 'name city');
  res.status(201).json({ success: true, job: populated });
};

// ── PUT /api/jobs/:id — update job (HR only) ─────────────────
const updateJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id, req.body, { new: true, runValidators: true }
  ).populate('branch', 'name city');

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }
  res.status(200).json({ success: true, job });
};

// ── DELETE /api/jobs/:id — delete job (HR only) ──────────────
const deleteJob = async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }
  res.status(200).json({ success: true, message: 'Job deleted' });
};

// ── PUT /api/jobs/:id/toggle — open/close job (HR only) ──────
const toggleJobStatus = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }
  job.isOpen = !job.isOpen;
  await job.save();
  res.status(200).json({ success: true, isOpen: job.isOpen });
};

module.exports = { getJobs, getAllJobsHR, getJob, createJob, updateJob, deleteJob, toggleJobStatus };
