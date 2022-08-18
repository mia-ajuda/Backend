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

  async findUserProfilebyProfileId(id) {

    const matchQuery = { _id: ObjectID(id) };
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

  async findUsersbyName(userId2,userName) {
    const query = {
      userId: {$ne:ObjectID(userId2)},
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

    const result2 = result.map((temp) => {
      const isFollowing = temp.followers.includes(userId2);    
      const {
              _doc:{_id,username,userId}, 
              $$populatedVirtuals:{user:{photo}},
              numberOfFollowers,numberOfFollowing
            } = temp;
      const newDoc = {
        _id,
        username,
        userId,
        photo,
        numberOfFollowers,
        numberOfFollowing,
        isFollowing
      }

      return newDoc;
    })

    
    
    
    return result2;

  }

  async getUserActivitiesById(id) {
    const query = { userId: ObjectID(id) };
    const networkProfileFields = [
      '_id',
      'userId',
      'username',
    ];

    const userHelps = {
      path: 'userHelps',
      select: ['title','description']
    }

    const userOffers = {
      path: 'helpsOffers',
      select: ['title','description']
    }

    const populate = [userHelps,userOffers];
    let a =  await super.$list(query, networkProfileFields, populate);
    
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
