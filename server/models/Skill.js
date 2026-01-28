const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a skill name'],
    trim: true
  },
  proficiency: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  category: {
    type: String,
    enum: ['technical', 'soft', 'tools', 'languages', 'other'],
    default: 'technical'
  },
  status: {
    type: String,
    enum: ['learning', 'proficient', 'expert'],
    default: 'learning'
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

module.exports = mongoose.model('Skill', skillSchema);
