const express = require('express');
const router = express.Router();
const { submitVote, checkVoteStatus } = require('../controllers/voteController');

// @route   POST /api/vote
// @desc    Submit a vote for a fox
// @access  Public
router.post('/', submitVote);

// @route   GET /api/vote-status
// @desc    Check if user has already voted
// @access  Public
router.get('/vote-status', checkVoteStatus);

module.exports = router; 