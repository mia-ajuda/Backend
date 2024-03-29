const BadgeService = require('../services/BadgeService');
const saveError = require('../utils/ErrorHistory');
const parseBadgeByCategory = require('../utils/parseBadgeByCategory');

class BadgeController {
  constructor() {
    this.BadgeService = new BadgeService();
  }

  async updateOrCreateBadge(req, res, next) {
    const { userId, category } = req.body;

    try {
      let result = await this.BadgeService.createOrUpdateBadge(
        userId,
        category,
      );
      if (
        result.badge.template.nextBadge
        && result.badge.currentValue >= result.badge.template.nextBadge.neededValue
      ) {
        result = await this.BadgeService.updateBadgeReference(result.badge);
      }
      res.status(201).json(result);
      next();
    } catch (err) {
      await saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getBadgeHistory(req, res, next) {
    const userId = req.query.userId || null;
    try {
      const userBadges = await this.BadgeService.getBadgeList(userId);
      const allBadges = await this.BadgeService.getAllBadges();
      const parsedUserBadges = parseBadgeByCategory(userBadges);
      res.status(200).json({ userBadges: parsedUserBadges, allBadges });
      next();
    } catch (err) {
      await saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getBadgeList(req, res, next) {
    const userId = req.query.userId || null;
    try {
      const result = await this.BadgeService.getBadgeList(userId);
      res.status(200).json(result);
      next();
    } catch (err) {
      await saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async markBadgeAsViewed(req, res, next) {
    const { badgeId } = req.params;
    try {
      await this.BadgeService.markBadgeAsViewed(badgeId);
      res.status(200).json({ message: 'Badge visualized' });
      next();
    } catch (err) {
      await saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }
}

module.exports = BadgeController;
