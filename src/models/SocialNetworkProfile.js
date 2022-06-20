const mongoose = require('mongoose');

const SocialNetworkProfileSchema = new mongoose.Schema({
  
  userId:{  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    ref: 'socialNetworkProfile'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'socialNetworkProfile'
  }],
 
}, { collection: 'socialNetworkProfile' });

SocialNetworkProfileSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});


module.exports = mongoose.model('socialNetworkProfile', SocialNetworkProfileSchema);
