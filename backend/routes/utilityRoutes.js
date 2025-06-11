const express = require('express');
const router = express.Router();

// @route   GET /api/health
// @desc    Health check endpoint
// @access  Public
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Backend API',
    timestamp: new Date().toISOString() 
  });
});

// @route   GET /api/docs
// @desc    API documentation endpoint
// @access  Public
router.get('/docs', (req, res) => {
  res.json({
    endpoints: [
      {
        method: 'GET',
        path: '/api/foxes/random',
        description: 'Henter to tilfeldige revebilder',
        response: {
          success: true,
          images: [
            { id: 1, url: 'https://randomfox.ca/images/1.jpg' },
            { id: 2, url: 'https://randomfox.ca/images/2.jpg' }
          ]
        }
      },
      {
        method: 'POST',
        path: '/api/vote',
        description: 'Registrerer en stemme for et revebilde',
        body: { imageUrl: 'https://randomfox.ca/images/1.jpg' },
        response: {
          success: true,
          message: 'Takk for din stemme!',
          totalVotes: 42
        }
      },
      {
        method: 'GET',
        path: '/api/vote-status',
        description: 'Sjekker om bruker har stemt allerede',
        response: {
          success: true,
          hasVoted: false,
          message: 'Du kan stemme'
        }
      },
      {
        method: 'GET',
        path: '/api/statistics',
        description: 'Henter statistikk over mest populære rever',
        response: {
          success: true,
          statistics: {
            topFoxes: [],
            leader: {},
            totalVotes: 100
          }
        }
      }
    ]
  });
});

module.exports = router; 