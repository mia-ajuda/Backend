const mongoose = require('mongoose');

const errorHistorySchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  registerDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, { collection: 'errorHistory' });

module.exports = mongoose.model('ErrorHistory', errorHistorySchema);
