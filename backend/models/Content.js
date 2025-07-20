const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['email', 'notification', 'transcript', 'image', 'audio'],
  },
  prompt: {
    type: String,
    required: true,
  },
  generatedContent: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

contentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Content', contentSchema);