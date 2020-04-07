const BaseRepository = require("./BaseRepository");
const HelpSchema = require("../models/Help");
const UserSchema = require("../models/User");

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

  async list(id, status, except, helper) {
    const ownerId = except ? { $ne: id } : helper ? null : id;
    const helperId = helper ? id : null;
    const query = {};
    if (status) query.status = status;
    if (helper) query.helperId = helperId;
    else query.ownerId = ownerId;
    const result = await super.$list(query);
    return result;
  }

  async listNear(coords) {
    const users = await UserSchema.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coords,
          },
          $maxDistance: 200000,
        },
      },
    });
    const arrayUsersId = users.map((user) => user._id);

    const aggregation = [
      {
        $match: {
          ownerId: {
            $in: arrayUsersId,
          },
          status: "on_going",
        },
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
      return await super.$listAggregate(aggregation);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = HelpRepository;
