// server.js — Main Entry Point
// ATS Backend — Member 1

const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://ats-project-f223444-f223334.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/branches',    require('./routes/branches'));
app.use('/api/jobs',        require('./routes/jobs'));
app.use('/api/applications',require('./routes/applications'));
app.use('/api/interviews',  require('./routes/interviews'));

// ── Health Check ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'ATS API is running' });
});

// ── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
