// controllers/branchController.js — Branch Controller
// HR only: create, update, delete branches
// Public: get all branches, get single branch

const Branch = require('../models/Branch');

// ── GET /api/branches — get all branches (public) ────────────
const getBranches = async (req, res) => {
  const branches = await Branch.find({ isActive: true });
  res.status(200).json({ success: true, count: branches.length, branches });
};

// ── GET /api/branches/:id — get single branch (public) ───────
const getBranch = async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) {
    return res.status(404).json({ success: false, message: 'Branch not found' });
  }
  res.status(200).json({ success: true, branch });
};

// ── POST /api/branches — create branch (HR only) ─────────────
const createBranch = async (req, res) => {
  const branch = await Branch.create(req.body);
  res.status(201).json({ success: true, branch });
};

// ── PUT /api/branches/:id — update branch (HR only) ──────────
const updateBranch = async (req, res) => {
  const branch = await Branch.findByIdAndUpdate(
    req.params.id, req.body, { new: true, runValidators: true }
  );
  if (!branch) {
    return res.status(404).json({ success: false, message: 'Branch not found' });
  }
  res.status(200).json({ success: true, branch });
};

// ── DELETE /api/branches/:id — soft delete (HR only) ─────────
const deleteBranch = async (req, res) => {
  await Branch.findByIdAndUpdate(req.params.id, { isActive: false });
  res.status(200).json({ success: true, message: 'Branch deactivated' });
};

module.exports = { getBranches, getBranch, createBranch, updateBranch, deleteBranch };
