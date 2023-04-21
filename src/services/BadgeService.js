const BadgeRepository = require('../repository/BadgeRepository');
const BadgeTemplateRepository = require('../repository/BadgeTemplateRepository');

class BadgeService {
  constructor() {
    this.BadgeRepository = new BadgeRepository();
    this.BadgeTemplateRepository = new BadgeTemplateRepository();
  }

  async createBadge(userId, category) {
    const referenceBadge = await this.BadgeTemplateRepository.getFirstRankByCategory(category);
    const badge = await this.BadgeRepository.create({
      user: userId,
      template: referenceBadge._id,
    });
    return badge;
  }

  async getBadgeList(userId) {
    const badgeList = await this.BadgeRepository.listByUserId(userId);
    return badgeList;
  }
}

module.exports = BadgeService;
