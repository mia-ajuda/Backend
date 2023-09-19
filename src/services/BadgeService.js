const BadgeRepository = require('../repository/BadgeRepository');
const BadgeTemplateRepository = require('../repository/BadgeTemplateRepository');
const parseBadgeTemplateByCategory = require('../utils/parseBadgeTemplateByCategory');

class BadgeService {
  constructor() {
    this.BadgeRepository = new BadgeRepository();
    this.BadgeTemplateRepository = new BadgeTemplateRepository();
  }

  async createOrUpdateBadge(userId, category) {
    const badges = await this.BadgeRepository.listByUserId(userId);
    let badge = badges.find((item) => item.template.category === category);
    if (!badge) {
      const referenceBadge = await this.BadgeTemplateRepository.getFirstRankByCategory(category);
      badge = await this.BadgeRepository.create({
        user: userId,
        template: referenceBadge._id,
      });
    }
    badge.currentValue += 1;
    const updatedBadge = await this.BadgeRepository.update(badge);
    return { badge: updatedBadge };
  }

  async updateBadgeReference(badge) {
    badge.template = badge.template.nextBadge;
    badge.updatedAt = Date.now();
    const updatedBadge = await this.BadgeRepository.update(badge);
    return { badge: updatedBadge, recentUpdated: true };
  }

  async getBadgeList(userId) {
    const badgeList = await this.BadgeRepository.listByUserId(userId);
    return badgeList;
  }

  async getAllBadges() {
    const badges = await this.BadgeTemplateRepository.listAllSorted();
    return parseBadgeTemplateByCategory(badges);
  }

  async markBadgeAsViewed(badgeId) {
    const badge = await this.BadgeRepository.getById(badgeId);
    badge.visualizedAt = Date.now();
    await this.BadgeRepository.update(badge);
  }
}

module.exports = BadgeService;
