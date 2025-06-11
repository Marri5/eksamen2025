const Fox = require('../models/Fox');
const Vote = require('../models/Vote');

// Get voting statistics
const getStatistics = async (req, res) => {
  try {
    // Get top 10 most voted foxes
    const topFoxes = await Fox.find()
      .sort({ votes: -1 })
      .limit(10);

    // Get the leading fox
    const leader = topFoxes[0];

    // Get total votes
    const totalVotes = await Vote.countDocuments();

    res.json({
      success: true,
      statistics: {
        topFoxes: topFoxes.map(fox => ({
          id: fox._id,
          url: fox.url,
          votes: fox.votes
        })),
        leader: leader ? {
          url: leader.url,
          votes: leader.votes,
          message: `Rev ${leader._id.toString().slice(-2)} er søtest akkurat nå!`
        } : null,
        totalVotes
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kunne ikke hente statistikk' 
    });
  }
};

module.exports = {
  getStatistics
}; 