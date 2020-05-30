const NotificationService = require('../services/NotificationService');

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
            res.status(400).json({ error: err });
            next();
        }
    }
}

module.exports = NotificationController;
