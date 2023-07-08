const mongoose = require('mongoose');

const timelineEventTemplateSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    title: {
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
  },
  { collection: 'timelineEventTemplate' },
);

module.exports = mongoose.model('TimelineEventTemplate', timelineEventTemplateSchema);
