const BaseRepository = require("./BaseRepository");
const badgeTemplateSchema = require("../models/BadgeTemplate");

class BadgeTemplateRepository extends BaseRepository {
  constructor() {
    super(badgeTemplateSchema);
  }

  async getById(id) {
    const result = await super.$getById(id);
    return result;
  }

  async listByCategory(category) {
    const result = await super.$list({ category: category });
    return result;
  }

  async getFirstRankByCategory(category) {
    const result = await super.$findOne({ category: category, rank: 1 });
    return result;
  }
}

module.exports = BadgeTemplateRepository;
