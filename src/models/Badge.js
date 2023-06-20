const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    currentValue: {
      type: Number,
      default: 0,
    },
    template: {
      type: Number,
      ref: 'BadgeTemplate',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    visualizedAt: {
      type: Date,
    },
  },
  { collection: 'badge' },
);

module.exports = mongoose.model('Badge', badgeSchema);
