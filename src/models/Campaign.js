const mongoose = require('mongoose');
const helpStatusEnum = require('../utils/enums/helpStatusEnum');
const {
  getDistance,
  calculateDistance,
} = require('../utils/geolocation/calculateDistance');

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

campaignSchema.virtual('categories', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
});
campaignSchema.virtual('entity', {
  ref: 'Entity',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});

campaignSchema.virtual('distances')
  .set(({ campaignCoords, coords }) => {
    campaignCoords = {
      longitude: campaignCoords[0],
      latitude: campaignCoords[1],
    };
    const coordinates = {
      longitude: coords[0],
      latitude: coords[1],
    };
    this.distanceValue = calculateDistance(coordinates, campaignCoords);
    this.distance = getDistance(coordinates, campaignCoords);
  });

campaignSchema.virtual('distanceValue')
  .get(() => this.distanceValue);
campaignSchema.virtual('distance')
  .get(() => this.distance);

module.exports = mongoose.model('Campaign', campaignSchema);
