const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  active: {
    default: true,
    type: Boolean,
  },
}, { collection: 'category' });

module.exports = mongoose.model('Category', categorySchema);
