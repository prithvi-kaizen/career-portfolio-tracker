const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a certification name'],
    trim: true
  },
  platform: {
    type: String,
    required: [true, 'Please add the platform name'],
    trim: true
  },
  completionDate: {
    type: Date,
    required: [true, 'Please add completion date']
  },
  certificateLink: {
    type: String,
    trim: true
  },
  credentialId: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Certification', certificationSchema);
