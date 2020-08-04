const { Schema, model } = require('mongoose');
const helpStatusEnum = require('../utils/enums/helpStatusEnum');

const offeredHelpSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 300,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(helpStatusEnum),
    default: helpStatusEnum.WAITING,
  },
  possibleHelpedUsers: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: false,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  helpedUserId: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: false,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  finishedDate: {
    type: Date,
    required: false,
  },
  active: {
    default: true,
    type: Boolean,
  },
},
{
  collection: 'helpOffer',
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

offeredHelpSchema.virtual('user', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
});

module.exports = model('OfferedHelp', offeredHelpSchema);
