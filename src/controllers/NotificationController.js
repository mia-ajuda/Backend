const NotificationService = require('../services/NotificationService');
const saveError = require('../utils/ErrorHistory');

class NotificationController {
  constructor() {
    this.notificationService = new NotificationService();
  }

  async getUserNotificationsById(req, res, next) {
    const { id } = req.params;

    try {
      const result = await this.notificationService.getUserNotificationsById(id);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }
}

module.exports = NotificationController;
