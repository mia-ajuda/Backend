const BaseRepository = require('./BaseRepository');
const badgeTemplateSchema = require('../models/BadgeTemplate');

class BadgeTemplateRepository extends BaseRepository {
  constructor() {
    super(badgeTemplateSchema);
  }

  async getById(id) {
    const result = await super.$getById(id);
    return result;
  }

  async listByCategory(category) {
    const result = await super.$list({ category });
    return result;
  }

  async getFirstRankByCategory(category) {
    const result = await super.$findOne({ category, rank: 1 });
    return result;
  }

  async listAllSorted() {
    const sort = {
      category: 1,
      rank: 1,
    };
    const result = await super.$list({}, null, null, sort);
    return result;
  }
}

module.exports = BadgeTemplateRepository;
