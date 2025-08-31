const mongoose = require('mongoose');

const apTuition = new mongoose.Schema({
  tuitionName: { type: String, required: true },
  subjects: [String],
  mode: { type: String, enum: ['Online', 'Offline'], default: 'Offline' },
  fee: {
  amount: { type: Number },
  type: { type: String }
  },
  image: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('APTuition', apTuition);
