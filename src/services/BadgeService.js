const BadgeRepository = require("../repository/BadgeRepository");
const BadgeTemplateRepository = require("../repository/BadgeTemplateRepository");

class BadgeService {
  constructor() {
    this.BadgeRepository = new BadgeRepository();
    this.BadgeTemplateRepository = new BadgeTemplateRepository();
  }

  async createOrUpdateBadge(userId, category) {
    const badges = await this.BadgeRepository.listByUserId(userId);
    let badge = badges.find((item) => item.template.category === category);
    if (!badge) {
      const referenceBadge =
        await this.BadgeTemplateRepository.getFirstRankByCategory(category);
      badge = await this.BadgeRepository.create({
        user: userId,
        template: referenceBadge._id,
      });
    }
    badge.currentValue += 1;
    const updatedBadge = await this.BadgeRepository.update(badge);
    return updatedBadge;
  }

  async getBadgeList(userId) {
    const badgeList = await this.BadgeRepository.listByUserId(userId);
    return badgeList;
  }
}

module.exports = BadgeService;
