const express = require('express');
const router = express.Router();
const { getRandomFoxes } = require('../controllers/foxController');

// @route   GET /api/foxes/random
// @desc    Get two random fox images
// @access  Public
router.get('/random', getRandomFoxes);

module.exports = router; 