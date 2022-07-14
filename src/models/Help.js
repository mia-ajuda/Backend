const mongoose = require('mongoose');
const helpStatusEnum = require('../utils/enums/helpStatusEnum');
const {
  getDistance,
  calculateDistance,
} = require('../utils/geolocation/calculateDistance');

const helpSchema = new mongoose.Schema(
  {
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
    possibleHelpers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    }],
    possibleEntities: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entity',
      required: false,
    }],
    categoryId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
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
    collection: 'userHelp',
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

helpSchema.virtual('categories', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
});
helpSchema.virtual('user', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});

helpSchema.virtual('distances')
  .set(({ userCoords, coords }) => {
    userCoords = {
      longitude: userCoords[0],
      latitude: userCoords[1],
    };
    const coordinates = {
      longitude: coords[0],
      latitude: coords[1],
    };
    this.distanceValue = calculateDistance(coordinates, userCoords);
    this.distance = getDistance(coordinates, userCoords);
  });

helpSchema.virtual('distanceValue')
  .get(() => this.distanceValue);
helpSchema.virtual('distance')
  .get(() => this.distance);

module.exports = mongoose.model('Help', helpSchema);
