/**
 * API Routes
 * Defines all API endpoints for the fox voting system
 */

const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const foxService = require('../services/foxService');

/**
 * GET /api/foxes
 * Fetch random fox images for voting
 */
router.get('/foxes', async (req, res) => {
  try {
    console.log('Fetching random foxes...');
    
    // Get count from query parameter, default to 2
    const count = parseInt(req.query.count) || 2;
    
    // Validate count parameter
    if (count < 1 || count > 10) {
      return res.status(400).json({
        success: false,
        error: 'Count must be between 1 and 10'
      });
    }
    
    const foxes = await foxService.getMultipleFoxes(count);
    
    console.log(`Successfully fetched ${foxes.length} foxes`);
    
    res.json({
      success: true,
      data: foxes,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in /api/foxes:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fox images',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/vote
 * Submit a vote for a fox image
 */
router.post('/vote', async (req, res) => {
  try {
    const { foxId, imageUrl } = req.body;
    const voterIp = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    
    console.log(`Vote request for foxId: ${foxId} from IP: ${voterIp}`);
    
    // Validate required fields
    if (!foxId || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'foxId and imageUrl are required'
      });
    }
    
    // Validate image URL
    if (!foxService.isValidFoxImage(imageUrl)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid fox image URL'
      });
    }
    
    // Check for recent votes from same IP for same fox (basic spam prevention)
    const recentVote = await Vote.findOne({
      foxId: foxId,
      voterIp: voterIp,
      votedAt: { $gte: new Date(Date.now() - 60 * 1000) } // Within last minute
    });
    
    if (recentVote) {
      return res.status(429).json({
        success: false,
        error: 'You have already voted for this fox recently. Please wait before voting again.'
      });
    }
    
    // Create new vote
    const vote = new Vote({
      foxId: foxId,
      imageUrl: imageUrl,
      voterIp: voterIp,
      userAgent: userAgent
    });
    
    await vote.save();
    
    console.log(`Vote saved successfully for foxId: ${foxId}`);
    
    // Get updated statistics
    const stats = await Vote.getStatistics();
    const topFox = await Vote.getTopFox();
    
    res.json({
      success: true,
      message: 'Vote recorded successfully!',
      data: {
        vote: {
          foxId: vote.foxId,
          votedAt: vote.votedAt
        },
        topFox: topFox,
        totalVotes: await Vote.countDocuments()
      }
    });
    
  } catch (error) {
    console.error('Error in /api/vote:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to record vote',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/statistics
 * Get voting statistics
 */
router.get('/statistics', async (req, res) => {
  try {
    console.log('Fetching voting statistics...');
    
    const [stats, topFox, totalVotes] = await Promise.all([
      Vote.getStatistics(),
      Vote.getTopFox(),
      Vote.countDocuments()
    ]);
    
    // Calculate additional statistics
    const uniqueVoters = await Vote.distinct('voterIp').then(ips => ips.length);
    const uniqueFoxes = await Vote.distinct('foxId').then(foxes => foxes.length);
    
    // Get recent activity (last 24 hours)
    const recentActivity = await Vote.countDocuments({
      votedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    console.log(`Statistics: ${totalVotes} total votes, ${uniqueFoxes} unique foxes`);
    
    res.json({
      success: true,
      data: {
        topFoxes: stats,
        topFox: topFox,
        summary: {
          totalVotes: totalVotes,
          uniqueVoters: uniqueVoters,
          uniqueFoxes: uniqueFoxes,
          recentActivity: recentActivity
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in /api/statistics:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbHealthy = await Vote.countDocuments().then(() => true).catch(() => false);
    
    // Check fox API health
    const foxApiHealth = await foxService.getApiHealth();
    
    const health = {
      status: dbHealthy && foxApiHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'healthy' : 'unhealthy',
        foxApi: foxApiHealth
      },
      uptime: process.uptime()
    };
    
    const statusCode = health.status === 'healthy' ? 200 : 503;
    
    res.status(statusCode).json(health);
    
  } catch (error) {
    console.error('Error in health check:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/fox/:foxId/votes
 * Get vote count for specific fox
 */
router.get('/fox/:foxId/votes', async (req, res) => {
  try {
    const { foxId } = req.params;
    
    const voteCount = await Vote.countDocuments({ foxId: foxId });
    
    res.json({
      success: true,
      data: {
        foxId: foxId,
        voteCount: voteCount
      }
    });
    
  } catch (error) {
    console.error(`Error getting votes for fox ${req.params.foxId}:`, error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get fox vote count'
    });
  }
});

module.exports = router; 