const mongoose = require('mongoose')
const helpSchema = require('./help')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    address: {
        cep: String,
        number: {
            type: Number,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        complement: String
    },
    location: {
        latitude: Number,
        longitude: Number
    },
    phone: {
        type: String,
        required: true
    },
    registerDate: {
        type: Date,
        default: Date.now
    }
}, {collection: 'user'})

module.exports = mongoose.model('User', userSchema)