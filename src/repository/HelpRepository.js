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

  async list(id) {
    const query = id ? { ownerId: { $ne: id } } : {};
    return await super.$list(query);
  }

  async listByStatus(id, status) {
    return await super.$list({ ownerId: id, status: status });
  }
  async listNear(coords) {
    const users = await UserSchema.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coords,
          },
          $maxDistance: 10000,
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
