const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    id: String,
    expiredIn: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  registerDate: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Session', sessionSchema);