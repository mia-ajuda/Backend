const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    currentValue: {
      type: Number,
      default: 0,
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BadgeTemplate',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { collection: 'badge' },
);

module.exports = mongoose.model('Badge', badgeSchema);
