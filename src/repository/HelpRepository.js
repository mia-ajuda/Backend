const BaseRepository = require("./BaseRepository");
const HelpSchema = require("../models/Help");
const UserSchema = require("../models/User");
const ObjectId = require("mongodb").ObjectID;
const calculateDistance = require("../utils/geolocation/calculateDistance");

class HelpRepository extends BaseRepository {
  constructor() {
    super(HelpSchema);
  }

  async create(help) {
    return await super.$save(help);
  }

  async getById(id) {
    return await super.$getById(id);
  }

  async list(id, status, except, helper, categoryArray) {
    const ownerId = except ? { $ne: id } : helper ? null : id;
    const helperId = helper ? id : null;
    const query = {};
    if (status) query.status = status;
    if (categoryArray) query.categoryId = { $in: categoryArray };
    if (helper) query.helperId = helperId;
    else query.ownerId = ownerId;
    const result = await super.$list(query);
    return result;
  }

  async listNear(coords, except, id, categoryArray) {
    const query = {};
    const location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: coords,
        },
        $maxDistance: 200000,
      },
    };
    const ownerId = except ? { $ne: id } : null;

    query.location = location;
    query.ownerId = ownerId;

    const users = await UserSchema.find(query);
    const arrayUsersId = users.map((user) => user._id);

    const matchQuery = {};

    matchQuery.status = "on_going";

    matchQuery.ownerId = {
      $in: arrayUsersId,
    };

    if (categoryArray) {
      matchQuery.categoryId = {
        $in: categoryArray.map((categoryString) => ObjectId(categoryString)),
      };
    }

    const aggregation = [
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "user",
          localField: "ownerId",
          foreignField: "_id",
          as: "user",
        },
      },
    ];

    try {
      const helps = await super.$listAggregate(aggregation);
      const helpsWithDistance = helps.map((help) => {
        const coordinates = {
          latitude: coords[1],
          longitude: coords[0],
        };
        const helpCoords = {
          latitude: help.user[0].location.coordinates[1],
          longitude: help.user[0].location.coordinates[0],
        };
        help.distance = calculateDistance(coordinates, helpCoords);

        return help;
      });

      return helpsWithDistance;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = HelpRepository;
