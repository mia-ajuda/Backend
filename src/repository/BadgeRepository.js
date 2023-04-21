const BaseRepository = require('./BaseRepository');
const BadgeSchema = require('../models/Badge');

class BadgeRepository extends BaseRepository {
  constructor() {
    super(BadgeSchema);
  }

  async create(badge) {
    const result = await super.$save(badge);
    return result;
  }

  async getByUserId(userId) {
    const result = await super.$findOne({ user: userId }, null, 'template');
    return result;
  }

  async listByUserId(userId) {
    const result = await super.$list({ user: userId }, null, 'template');
    return result;
  }

  async update(badge) {
    const result = await super.$update(badge);
    return result;
  }
}

module.exports = BadgeRepository;
