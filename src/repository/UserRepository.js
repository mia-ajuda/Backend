const BaseRepository = require('./BaseRepository');
const UserSchema = require('../models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(UserSchema);
  }

  async create(user) {
    const result = await super.$save(user);
    return result;
  }

  async getById(id) {
    const result = await super.$getById(id);
    return result;
  }

  async getUserByEmail(email) {
    const result = await super.$list({ email });
    return result[0];
  }

  async update(user) {
    const result = await super.$update(user);
    return result;
  }

  async checkUserExistence(id) {
    const users = await super.$listAggregate([
      {
        $match: {
          $or: [
            { cpf: id },
            { email: id },
          ],
        },
      }, {
        $count: 'id',
      },
    ]);

    let result = 0;

    if (users[0] && users[0].id > 0) {
      result = users[0].id;
    }

    return result;
  }

  async removeUser({ id, email }) {
    const query = {};
    query._id = id;
    query.email = email;

    await super.$destroy(query);
  }

  async getUsersWithDevice() {
    const users = await super.$list({ deviceId: { $ne: null } });

    return users;
  }

  async findOneUserWithProjection(query, projection) {
    const user = await super.$findOne(query, projection);
    return user;
  }
}

module.exports = UserRepository;
