const { Schema, model } = require('mongoose');
const helpStatusEnum = require('../utils/enums/helpStatusEnum');
const Point = require('./Point');
const { calculateDistance, getDistance } = require('../utils/geolocation/calculateDistance');

const offeredHelpSchema = new Schema(
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
    possibleHelpedUsers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    }],
    possibleEntities: [{
      type: Schema.Types.ObjectId,
      ref: 'Entity',
      required: false,
    }],
    categoryId: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    helpedUserId: [{
      type: Schema.Types.ObjectId,
      ref: ['User', 'Entity'],
      required: false,
    }],
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
    location: {
      type: Point,
      index: '2dsphere',
      required: false,
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
  },
);

offeredHelpSchema.virtual('user', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});

offeredHelpSchema.virtual('categories', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
});

offeredHelpSchema.virtual('helpedUsers', {
  ref: ['User', 'Entity'],
  localField: 'helpedUserId',
  foreignField: '_id',
});

offeredHelpSchema.virtual('distances')
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

offeredHelpSchema.virtual('distanceValue')
  .get(() => this.distanceValue);

offeredHelpSchema.virtual('distance')
  .get(() => this.distance);

module.exports = model('OfferedHelp', offeredHelpSchema);
