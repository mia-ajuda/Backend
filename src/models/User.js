const mongoose = require('mongoose');
const Point = require('./Point');

const riskGroupTypes = require('./RiskGroup');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    riskGroup: {
        type: [String],
        enum: [...Object.keys(riskGroupTypes)],
    },
    photo: {
        type: String,
        required: true,
    },
    address: {
        cep: {
            type: String,
            required: true,
        },
        number: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        complement: String,
    },
    mentalHealthcareProfessional: {
        type: Boolean,
        default: false,
    },
    location: {
        type: Point,
        index: '2dsphere',
    },
    phone: {
        type: String,
        required: true,
    },
    registerDate: {
        type: Date,
        default: Date.now,
    },
    active: {
        default: true,
        type: Boolean,
    },
}, { collection: 'user' });

module.exports = mongoose.model('User', userSchema);
