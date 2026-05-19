// config/cloudinary.js — Cloudinary Configuration
// All file uploads (resumes, cover letters, profile pics)
// go to Cloudinary. Only the URL is stored in MongoDB.

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for resumes and cover letters (PDF/DOCX)
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ats/documents',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw'   // raw = non-image files
  }
});

// Storage for profile pictures (images)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ats/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }]
  }
});

const uploadDocument = multer({ storage: documentStorage });
const uploadImage    = multer({ storage: imageStorage });

module.exports = { cloudinary, uploadDocument, uploadImage };
