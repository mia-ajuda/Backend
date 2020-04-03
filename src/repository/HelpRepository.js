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
            coordinates: coords
          },
          $maxDistance: 10000
        }
      }
    });

    const arrayUsersId = users.map(user => user._id);

    const query = {
      // ownerId: {
      //   $in: arrayUsersId
      // },
      status: "on_going"
    };
    try {
      return await super.$listPopulate(query);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = HelpRepository;
