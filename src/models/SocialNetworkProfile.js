const mongoose = require('mongoose');

const SocialNetworkProfileSchema = new mongoose.Schema({
  
  userId:{  
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
    ref: 'socialNetworkProfile'
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
  justOne: true
});

SocialNetworkProfileSchema.virtual('entity', {
  ref: 'Entity',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

SocialNetworkProfileSchema.virtual('Followers', {
  ref: 'socialNetworkProfile',
  localField: 'followers',
  foreignField: 'userId'
});

SocialNetworkProfileSchema.virtual('Following', {
  ref: 'socialNetworkProfile',
  localField: 'following',
  foreignField: 'userId'
});

SocialNetworkProfileSchema.virtual('helpsOffers', {
  ref: 'OfferedHelp',
  localField: 'userId',
  foreignField: 'ownerId'
});

SocialNetworkProfileSchema.virtual('userHelps', {
  ref: 'Help',
  localField: 'userId',
  foreignField: 'ownerId'
});


SocialNetworkProfileSchema.virtual('numberOfFollowers').get(function() {
  return this.followers.length;
});

SocialNetworkProfileSchema.virtual('numberOfFollowing').get(function() {
  return this.following.length;
});




module.exports = mongoose.model('socialNetworkProfile', SocialNetworkProfileSchema);
