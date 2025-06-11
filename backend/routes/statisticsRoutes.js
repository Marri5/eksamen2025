const express = require('express');
const router = express.Router();
const { getStatistics } = require('../controllers/statisticsController');

// @route   GET /api/statistics
// @desc    Get voting statistics
// @access  Public
router.get('/', getStatistics);

module.exports = router; 