const { v4: uuidv4 } = require('uuid');
const Fox = require('../models/Fox');
const Vote = require('../models/Vote');

// Vote for a fox
const submitVote = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ingen bilde-URL mottatt' 
      });
    }

    // Get or create user ID from cookie
    let userId = req.cookies.foxvoting_user_id;
    if (!userId) {
      userId = uuidv4();
      res.cookie('foxvoting_user_id', userId, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax'
      });
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({ userId: userId });
    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'Du har allerede stemt! Bare én stemme per bruker er tillatt.',
        alreadyVoted: true
      });
    }

    // Find or create fox
    let fox = await Fox.findOne({ url: imageUrl });
    if (!fox) {
      fox = await Fox.create({ url: imageUrl });
    }

    // Increment vote count
    fox.votes += 1;
    await fox.save();

    // Create vote record with user ID
    await Vote.create({
      foxId: fox._id,
      userId: userId,
      timestamp: new Date()
    });

    res.json({ 
      success: true, 
      message: 'Takk for din stemme!',
      totalVotes: fox.votes,
      userId: userId // Optional: for debugging
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kunne ikke registrere stemmen. Vennligst prøv igjen.' 
    });
  }
};

// Check if user has already voted
const checkVoteStatus = async (req, res) => {
  try {
    const userId = req.cookies.foxvoting_user_id;
    
    if (!userId) {
      return res.json({
        success: true,
        hasVoted: false,
        message: 'Ingen stemme registrert ennå'
      });
    }

    const existingVote = await Vote.findOne({ userId: userId });
    
    res.json({
      success: true,
      hasVoted: !!existingVote,
      message: existingVote ? 'Du har allerede stemt' : 'Du kan stemme',
      voteTimestamp: existingVote ? existingVote.timestamp : null
    });
  } catch (error) {
    console.error('Error checking vote status:', error);
    res.status(500).json({
      success: false,
      message: 'Kunne ikke sjekke stemme-status'
    });
  }
};

module.exports = {
  submitVote,
  checkVoteStatus
}; 