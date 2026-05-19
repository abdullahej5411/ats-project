// routes/branches.js — Branch Routes

const express = require('express');
const router  = express.Router();
const { protect, authorizeHR } = require('../middleware/auth');
const {
  getBranches, getBranch, createBranch, updateBranch, deleteBranch
} = require('../controllers/branchController');

router.get('/',         getBranches);
router.get('/:id',      getBranch);
router.post('/',        protect, authorizeHR, createBranch);
router.put('/:id',      protect, authorizeHR, updateBranch);
router.delete('/:id',   protect, authorizeHR, deleteBranch);

module.exports = router;
