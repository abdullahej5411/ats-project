// routes/jobs.js — Job Routes

const express = require('express');
const router  = express.Router();
const { protect, authorizeHR } = require('../middleware/auth');
const {
  getJobs, getAllJobsHR, getJob,
  createJob, updateJob, deleteJob, toggleJobStatus
} = require('../controllers/jobController');

router.get('/',           getJobs);           // public — open jobs with filters
router.get('/hr/all',     protect, authorizeHR, getAllJobsHR); // HR — all jobs
router.get('/:id',        getJob);            // public — single job
router.post('/',          protect, authorizeHR, createJob);
router.put('/:id',        protect, authorizeHR, updateJob);
router.delete('/:id',     protect, authorizeHR, deleteJob);
router.put('/:id/toggle', protect, authorizeHR, toggleJobStatus);

module.exports = router;
