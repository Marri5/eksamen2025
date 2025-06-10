/**
 * Vote Model
 * Represents a vote for a fox image in the database
 */

const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  // Fox image identifier (filename from randomfox.ca)
  foxId: {
    type: String,
    required: true,
    trim: true
  },
  
  // Full URL to the fox image
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  
  // IP address of the voter (for basic duplicate prevention)
  voterIp: {
    type: String,
    required: true
  },
  
  // User agent for additional tracking
  userAgent: {
    type: String,
    default: ''
  },
  
  // Timestamp of when the vote was cast
  votedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Add timestamps for created and updated
  timestamps: true,
  
  // Create indexes for better query performance
  indexes: [
    { foxId: 1 },
    { votedAt: -1 },
    { voterIp: 1, foxId: 1 } // Compound index for duplicate checking
  ]
});

// Create a compound index to prevent duplicate votes from same IP for same fox
voteSchema.index({ foxId: 1, voterIp: 1 }, { unique: false });

// Static method to get vote statistics
voteSchema.statics.getStatistics = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$foxId',
        voteCount: { $sum: 1 },
        imageUrl: { $first: '$imageUrl' },
        lastVote: { $max: '$votedAt' }
      }
    },
    {
      $sort: { voteCount: -1 }
    },
    {
      $limit: 10
    }
  ]);
};

// Static method to get top fox
voteSchema.statics.getTopFox = async function() {
  const result = await this.aggregate([
    {
      $group: {
        _id: '$foxId',
        voteCount: { $sum: 1 },
        imageUrl: { $first: '$imageUrl' }
      }
    },
    {
      $sort: { voteCount: -1 }
    },
    {
      $limit: 1
    }
  ]);
  
  return result.length > 0 ? result[0] : null;
};

// Instance method to check if vote is recent
voteSchema.methods.isRecent = function() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.votedAt > fiveMinutesAgo;
};

module.exports = mongoose.model('Vote', voteSchema); 