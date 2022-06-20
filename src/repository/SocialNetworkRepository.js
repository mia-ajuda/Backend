const BaseRepository = require('./BaseRepository');
const SocialNetworkProfileSchema = require('../models/SocialNetworkProfile');
const { ObjectID } = require('mongodb');

class SocialNetworkRepository extends BaseRepository {
  constructor() {
    super(SocialNetworkProfileSchema);
  }

  async create(socialNetworkProfile) {
    const result = await super.$save(socialNetworkProfile);
    return result;
  }

  async findUserProfilebyUserId(id) {

    const matchQuery = { userId: ObjectID(id) };
    const socialNetworkProfileFields = [
      '_id', 'userId', 'username',
      'followers', 'following',
    ];
    return super.$findOne(
      matchQuery,
      socialNetworkProfileFields
    );
  }

  async updateProfile(socialNetworkProfile) {
    await super.$update(socialNetworkProfile);
  }
}

module.exports = SocialNetworkRepository;
