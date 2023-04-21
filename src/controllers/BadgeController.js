const BadgeService = require('../services/BadgeService');
const saveError = require('../utils/ErrorHistory');

class BadgeController {
  constructor() {
    this.BadgeService = new BadgeService();
  }

  async updateOrCreateBadge(req, res, next) {
    const { userId, category } = req.body;

    try {
      const result = await this.BadgeService.createOrUpdateBadge(
        userId,
        category,
      );
      res.status(201).json(result);
      next();
    } catch (err) {
      saveError(err);
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
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }
}

module.exports = BadgeController;
