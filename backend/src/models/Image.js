const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  votes: {
    type: Number,
    default: 0
  },
  voters: [{
    type: String  // Store IP addresses or session IDs
  }]
});

module.exports = mongoose.model('Image', imageSchema); 