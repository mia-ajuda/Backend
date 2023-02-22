const mongoose = require('mongoose');

const SocialNetworkProfileSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'socialNetworkProfile',
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'socialNetworkProfile',
  }],

}, {
  collection: 'socialNetworkProfile',
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

SocialNetworkProfileSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

SocialNetworkProfileSchema.virtual('entity', {
  ref: 'Entity',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

SocialNetworkProfileSchema.virtual('Followers', {
  ref: 'socialNetworkProfile',
  localField: 'followers',
  foreignField: '_id',
});

SocialNetworkProfileSchema.virtual('Following', {
  ref: 'socialNetworkProfile',
  localField: 'following',
  foreignField: '_id',
});

SocialNetworkProfileSchema.virtual('helpsOffers', {
  ref: 'OfferedHelp',
  localField: 'userId',
  foreignField: 'ownerId',
});

SocialNetworkProfileSchema.virtual('userHelps', {
  ref: 'Help',
  localField: 'userId',
  foreignField: 'ownerId',
});


SocialNetworkProfileSchema.virtual('numberOfFollowers').get(function () {
  return this.followers ? this.followers.length : 0;
});

SocialNetworkProfileSchema.virtual('numberOfFollowing').get(function () {
  return this.following ? this.following.length : 0;
});


module.exports = mongoose.model('socialNetworkProfile', SocialNetworkProfileSchema);
