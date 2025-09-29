const mongoose = require('mongoose');

const suggestedTuitionSchema = new mongoose.Schema({
  tuitionName: {
    type: String,
    required: true
  },
  contactInfo: String,
  location: String,
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  suggestedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SuggestedTuition', suggestedTuitionSchema);
