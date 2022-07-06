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

  async destroy(id) {
    const query = {};
    query._id = id;
    
    await super.$destroy(query);
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

  async findUsersbyName(userId,userName) {
   
    const query = {
      userId: {$ne:ObjectID(userId)},
      username: {$regex: userName,$options:'i'}
    }

    const selectField = [
      'userId',
      'username',
      'followers',
      'following',
    ];

    const populate  = {
      path: 'user',
      select: ['photo']
    };
    

    const result = await super.$list(query,selectField,populate);
    
    return result;

  }

  async getUserByIdWithHelpsAndOffers(id) {
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
      select: ['phone', 'name', 'birthday', 'address.city']
    };

    const entity = {
      path: 'entity',
      select: ['phone', 'name', 'address.city']
    };


    const userHelps = {
      path: 'userHelps',
      select: ['title','description']
    }

    const userOffers = {
      path: 'helpsOffers',
      select: ['title','description']
    }


    const populate = [user,entity,userHelps,userOffers];
    let a =  await super.$findOne(query, networkProfileFields, populate);
    console.log(a);
    a.number_of_followers = a.followers.length;
    a.number_of_following = a.following.length;
    console.log('----------------------------------------------');
    console.log(a);
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
      select: ['phone', 'name', 'birthday', 'address.city']
    };

    const entity = {
      path: 'entity',
      select: ['phone', 'name', 'address.city']
    };

    const followers = {
      path: 'Followers',
      select: ['_id','userId','username','followers','following']
    };

    const following = {
      path: 'Following',
      select: ['_id','userId','username','followers','following']
    }

    const populate = [user,followers,following,entity];
    let a =  await super.$findOne(query, networkProfileFields, populate);
    console.log(a);
    return a;
  }




}

module.exports = SocialNetworkRepository;
