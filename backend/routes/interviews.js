// routes/interviews.js — Interview Routes

const express = require('express');
const router  = express.Router();
const { protect, authorizeHR } = require('../middleware/auth');
const {
  scheduleInterview, getAllInterviews, getMyInterviews,
  updateInterview, cancelInterview
} = require('../controllers/interviewController');

router.post('/',           protect, authorizeHR, scheduleInterview);
router.get('/',            protect, authorizeHR, getAllInterviews);
router.get('/my',          protect, getMyInterviews);
router.put('/:id',         protect, authorizeHR, updateInterview);
router.put('/:id/cancel',  protect, authorizeHR, cancelInterview);

module.exports = router;
