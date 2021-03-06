const mongoose = require('mongoose');
const helpStatusEnum = require('../utils/enums/helpStatusEnum');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 500,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(helpStatusEnum),
    default: helpStatusEnum.WAITING,
  },
  categoryId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Category',
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  helperId: {
    type: mongoose.Schema.Types.ObjectId,
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
  collection: 'campaign',
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

campaignSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
});
campaignSchema.virtual('entity', {
  ref: 'Entity',
  localField: 'ownerId',
  foreignField: '_id',
});

module.exports = mongoose.model('Campaign', campaignSchema);
