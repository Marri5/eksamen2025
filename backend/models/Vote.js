const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  foxId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fox',
    required: true
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

module.exports = mongoose.model('Vote', voteSchema); 