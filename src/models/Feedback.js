const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { collection: 'feedback' },
);

module.exports = mongoose.model('Feedback', feedbackSchema);
