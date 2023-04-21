const BaseRepository = require('./BaseRepository');
const BadgeInstanceSchema = require('../models/BadgeInstance');

class BadgeRepository extends BaseRepository {
  constructor() {
    super(BadgeInstanceSchema);
  }

  async getByUserId(userId) {
    const result = await super.$findOne({ user: userId });
    return result;
  }

  async listByUserId(userId) {
    const result = await super.$list({ user: userId });
    return result;
  }

  async update(badge) {
    const result = await super.$update(badge);
    return result;
  }
}

module.exports = BadgeRepository;
