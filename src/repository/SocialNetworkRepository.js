const { ObjectID } = require('mongodb');
const BaseRepository = require('./BaseRepository');
const SocialNetworkProfileSchema = require('../models/SocialNetworkProfile');
const mapSocialNetworkUser = require('../utils/mapSocialNetworkUser');

class SocialNetworkRepository extends BaseRepository {
  constructor() {
    super(SocialNetworkProfileSchema);
  }

  async create(socialNetworkProfile) {
    const result = await super.$save(socialNetworkProfile);
    return result;
  }

  async destroy(id) {
    const query = {};
    query._id = id;

    await super.$destroy(query);
  }

  async findUserProfilebyUserId(id) {
    const matchQuery = { userId: ObjectID(id) };
    const socialNetworkProfileFields = [
      '_id',
      'userId',
      'username',
      'followers',
      'following',
    ];

    const populate = {
      path: 'user',
      select: ['photo', 'biography'],
    };
    return super.$findOne(matchQuery, socialNetworkProfileFields, populate);
  }

  async findUserProfilebyProfileId(id) {
    const matchQuery = { _id: ObjectID(id) };
    const socialNetworkProfileFields = [
      '_id',
      'userId',
      'username',
      'followers',
      'following',
    ];
    return super.$findOne(matchQuery, socialNetworkProfileFields);
  }

  async updateProfile(socialNetworkProfile) {
    await super.$update(socialNetworkProfile);
  }

  async findUsersbyName(userProfileId, userName, limit = 20) {
    const query = {
      _id: { $ne: ObjectID(userProfileId) },
      username: { $regex: userName, $options: 'i' },
    };

    const selectField = ['userId', 'username', 'followers', 'following'];

    const populate = {
      path: 'user',
      select: ['photo', 'cnpj', 'cpf'],
    };

    const users = await super.$list(query, selectField, populate, null, limit);

    const mappedUsers = users.map((user) => mapSocialNetworkUser(user, userProfileId));

    return mappedUsers;
  }

  async getUserActivitiesById(id) {
    const query = { userId: ObjectID(id) };
    const networkProfileFields = ['_id', 'userId', 'username'];

    const userHelps = {
      path: 'userHelps',
      select: ['title', 'description'],
    };

    const userOffers = {
      path: 'helpsOffers',
      select: ['title', 'description'],
    };

    const populate = [userHelps, userOffers];
    const a = await super.$list(query, networkProfileFields, populate);

    return a;
  }

  async getByIdWithAggregation(id) {
    const query = { userId: ObjectID(id) };

    const networkProfileFields = [
      '_id',
      'userId',
      'username',
      'followers',
      'following',
    ];

    const user = {
      path: 'user',
      select: ['phone', 'name', 'birthday', 'address.city'],
    };

    const entity = {
      path: 'entity',
      select: ['phone', 'name', 'address.city'],
    };

    const followers = {
      path: 'Followers',
      select: ['_id', 'userId', 'username', 'followers', 'following'],
    };

    const following = {
      path: 'Following',
      select: ['_id', 'userId', 'username', 'followers', 'following'],
    };

    const populate = [user, followers, following, entity];
    const a = await super.$findOne(query, networkProfileFields, populate);
    return a;
  }

  async getFollowers(userProfileId, selectedProfileId) {
    const query = { _id: ObjectID(selectedProfileId) };

    const selectField = ['followers'];

    const followers = {
      path: 'Followers',
      populate: {
        path: 'user',
        select: ['photo', 'deviceId'],
      },
      select: ['userId', 'username', 'followers', 'following', 'cpf'],
    };
    const populate = [followers];

    const userInfo = await super.$findOne(query, selectField, populate);
    if (!userInfo.Followers) return [];
    const followersInfo = userInfo.Followers.map((follower) => mapSocialNetworkUser(follower, userProfileId));
    return followersInfo;
  }

  async getFollowing(userProfileId, selectedProfileId) {
    const query = { _id: ObjectID(selectedProfileId) };

    const selectField = ['following'];

    const following = {
      path: 'Following',
      populate: {
        path: 'user',
        select: ['photo'],
      },
      select: ['userId', 'username', 'followers', 'following'],
    };
    const populate = [following];

    const userInfo = await super.$findOne(query, selectField, populate);

    if (!userInfo.Following) return [];
    const followingInfo = userInfo.Following.map((followed) => mapSocialNetworkUser(followed, userProfileId));
    return followingInfo;
  }
}

module.exports = SocialNetworkRepository;
