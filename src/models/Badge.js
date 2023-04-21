const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    iconName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    neededValue: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    nextBadge: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Badge',
    },
  },
  { collection: 'badge' },
);

module.exports = mongoose.model('Badge', badgeSchema);
