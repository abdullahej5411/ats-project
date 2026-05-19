// routes/auth.js — Authentication Routes

const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../config/cloudinary');
const {
  register, login, getMe,
  updateProfile, updateProfilePic, changePassword
} = require('../controllers/authController');

router.post('/register',     register);
router.post('/login',        login);
router.get('/me',            protect, getMe);
router.put('/profile',       protect, updateProfile);
router.put('/profile-pic',   protect, uploadImage.single('profilePic'), updateProfilePic);
router.put('/change-password', protect, changePassword);

module.exports = router;
