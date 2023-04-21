const mongoose = require('mongoose');

const badgeTemplateSchema = new mongoose.Schema(
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
      enum: ['help', 'offer', 'share'],
    },
    nextBadge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BadgeTemplate',
    },
  },
  { collection: 'badgeTemplate' },
);

module.exports = mongoose.model('BadgeTemplate', badgeTemplateSchema);
