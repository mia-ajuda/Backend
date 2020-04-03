const mongoose = require('mongoose')

const helpSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        maxlength: 120,
        required: true
    },
    status: {
        type: String,
        enum: ['waiting', 'on_going', 'finished', 'deleted'],
        default: 'on_going',
    },
    possibleHelpers: {
        type: [mongoose.Schema.Types.ObjectId], ref: 'User',
        required: false
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category',
        // required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    helperId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: false
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    finishedDate: {
        type: Date,
        required: false
    }
}, { collection: 'userHelp' })

module.exports = mongoose.model('Help', helpSchema)