const mongoose = require('mongoose');

const SuggestedSchoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String },
  tags: { type: [String] },
  status: { type: String, default: 'pending' }, 
  suggestedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SuggestedSchool', SuggestedSchoolSchema);
