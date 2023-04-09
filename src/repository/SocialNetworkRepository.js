const { ObjectID } = require("mongodb");
const BaseRepository = require("./BaseRepository");
const SocialNetworkProfileSchema = require("../models/SocialNetworkProfile");

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
      "_id",
      "userId",
      "username",
      "followers",
      "following",
    ];

    const populate = {
      path: "user",
      select: ["photo"],
    };
    return super.$findOne(matchQuery, socialNetworkProfileFields, populate);
  }

  async findUserProfilebyProfileId(id) {
    const matchQuery = { _id: ObjectID(id) };
    const socialNetworkProfileFields = [
      "_id",
      "userId",
      "username",
      "followers",
      "following",
    ];
    return super.$findOne(matchQuery, socialNetworkProfileFields);
  }

  async updateProfile(socialNetworkProfile) {
    await super.$update(socialNetworkProfile);
  }

  async findUsersbyName(userProfileId, userName) {
    const query = {
      _id: { $ne: ObjectID(userProfileId) },
      username: { $regex: userName, $options: "i" },
    };

    const selectField = ["userId", "username", "followers", "following"];

    const populate = {
      path: "user",
      select: ["photo", "cnpj", "cpf"],
    };

    const users = await super.$list(query, selectField, populate);

    const mappedUsers = users.map((queryUser) => {
      const isFollowing = queryUser.followers.includes(userProfileId);
      const { numberOfFollowers, numberOfFollowing } = queryUser;
      const mappedUser = {
        _id: queryUser._id,
        username: queryUser.username,
        userId: queryUser.userId,
        photo: queryUser.user?.photo,
        cpf: queryUser.user?.cpf,
        cnpj: queryUser.user?.cnpj,
        numberOfFollowers,
        numberOfFollowing,
        isFollowing,
      };
      return mappedUser;
    });

    return mappedUsers;
  }

  async getUserActivitiesById(id) {
    const query = { userId: ObjectID(id) };
    const networkProfileFields = ["_id", "userId", "username"];

    const userHelps = {
      path: "userHelps",
      select: ["title", "description"],
    };

    const userOffers = {
      path: "helpsOffers",
      select: ["title", "description"],
    };

    const populate = [userHelps, userOffers];
    const a = await super.$list(query, networkProfileFields, populate);

    return a;
  }

  async getByIdWithAggregation(id) {
    const query = { userId: ObjectID(id) };

    const networkProfileFields = [
      "_id",
      "userId",
      "username",
      "followers",
      "following",
    ];

    const user = {
      path: "user",
      select: ["phone", "name", "birthday", "address.city"],
    };

    const entity = {
      path: "entity",
      select: ["phone", "name", "address.city"],
    };

    const followers = {
      path: "Followers",
      select: ["_id", "userId", "username", "followers", "following"],
    };

    const following = {
      path: "Following",
      select: ["_id", "userId", "username", "followers", "following"],
    };

    const populate = [user, followers, following, entity];
    const a = await super.$findOne(query, networkProfileFields, populate);
    return a;
  }

  async getFollowers(userProfileId, selectedProfileId) {
    const query = { _id: ObjectID(selectedProfileId) };

    const selectField = ["followers"];

    const followers = {
      path: "Followers",
      populate: {
        path: "user",
        select: ["photo", "deviceId"],
      },
      select: ["userId", "username", "followers", "following"],
    };
    const populate = [followers];

    let result = await super.$list(query, selectField, populate);

    // permite a adição de novos atributos no resultado
    result = JSON.parse(JSON.stringify(result));
    let result2 = 0;
    if (result.length > 0) {
      result2 = result[0].Followers.map((temp) => {
        temp.isFollowing = temp.followers.includes(userProfileId);
        temp.photo = temp.user.photo;
        delete temp.user;
        return temp;
      });
    }

    return result2;
  }

  async getFollowing(userProfileId, selectedProfileId) {
    const query = { _id: ObjectID(selectedProfileId) };

    const selectField = ["following"];

    const following = {
      path: "Following",
      populate: {
        path: "user",
        select: ["photo"],
      },
      select: ["userId", "username", "followers", "following"],
    };
    const populate = [following];

    let result = await super.$list(query, selectField, populate);

    // permite a adição de novos atributos no resultado
    result = JSON.parse(JSON.stringify(result));

    const result2 = result[0].Following.map((temp) => {
      temp.isFollowing = temp.followers.includes(userProfileId);
      temp.photo = temp.user.photo;
      delete temp.user;
      return temp;
    });

    return result2;
  }
}

module.exports = SocialNetworkRepository;
