const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        id: String,
        expiredIn: Date,
    },
    registerDate: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Session', sessionSchema);