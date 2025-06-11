const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  foxId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fox',
    required: true
  },
  userId: {
    type: String,
    required: true,
    index: true // Index for faster lookups
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userIp: {
    type: String,
    default: null
  }
});

// Ensure one vote per user
voteSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema); 