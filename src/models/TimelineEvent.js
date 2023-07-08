const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema(
  {
    template: {
      type: Number,
      ref: 'TimelineEventTemplate',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  { collection: 'timelineEvent' },
);

module.exports = mongoose.model('TimelineEvent', timelineEventSchema);
