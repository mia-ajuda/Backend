const BadgeRepository = require('../repository/BadgeRepository');

class BadgeService {
  constructor() {
    this.BadgeRepository = new BadgeRepository();
  }

  // TODO: Querys parecem idênticas

  async getBadgeList(userId) {
    const BadgeList = await this.BadgeRepository.listByUserId(userId);
    return BadgeList;
  }
}

module.exports = BadgeService;
