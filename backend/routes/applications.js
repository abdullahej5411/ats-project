// routes/applications.js — Application Routes

const express = require('express');
const router  = express.Router();
const { protect, authorizeHR, authorizeCandidate } = require('../middleware/auth');
const { uploadDocument } = require('../config/cloudinary');
const multer = require('multer');
const {
  applyForJob, getMyApplications, getAllApplications,
  getApplication, updateStatus, sendCustomEmail, getStats
} = require('../controllers/applicationController');

// Multer field config — resume (required) + coverLetter (optional)
const uploadFields = uploadDocument.fields([
  { name: 'resume',      maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 }
]);

router.post('/',           protect, authorizeCandidate, uploadFields, applyForJob);
router.get('/my',          protect, authorizeCandidate, getMyApplications);
router.get('/stats',       protect, authorizeHR, getStats);
router.get('/',            protect, authorizeHR, getAllApplications);
router.get('/:id',         protect, getApplication);
router.put('/:id/status',  protect, authorizeHR, updateStatus);
router.post('/:id/email',  protect, authorizeHR, sendCustomEmail);

module.exports = router;
