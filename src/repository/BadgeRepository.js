const BaseRepository = require('./BaseRepository');
const BadgeSchema = require('../models/Badge');

class BadgeRepository extends BaseRepository {
  constructor() {
    super(BadgeSchema);
    this.populateData = {
      path: 'template',
      populate: {
        path: 'nextBadge',
        model: 'BadgeTemplate',
      },
    };
  }

  async create(badge) {
    const result = await super.$save(badge);
    return result;
  }

  async getByUserId(userId) {
    const result = await super.$findOne(
      { user: userId },
      null,
      this.populateData,
    );
    return result;
  }

  async listByUserId(userId) {
    const result = await super.$list({ user: userId }, null, this.populateData);
    return result;
  }

  async update(badge) {
    const result = await super.$update(badge);
    return result;
  }
}

module.exports = BadgeRepository;
