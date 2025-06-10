const mongoose = require('mongoose');

const foxSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  votes: {
    type: Number,
    default: 0
  },
  lastShown: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Fox', foxSchema); 