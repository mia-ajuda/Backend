const mongoose = require('mongoose');

const badgeInstanceSchema = new mongoose.Schema(
  {
    currentValue: {
      type: Number,
      default: 1,
    },
    badge: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Badge',
      required: true,
    },
    user: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },
  },
  { collection: 'badgeInstance' },
);

module.exports = mongoose.model('BadgeInstance', badgeInstanceSchema);
