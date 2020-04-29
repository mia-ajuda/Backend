const NotificationRepository = require('../repository/NotificationRepository');

class NotificationService {
    constructor() {
        this.notificationRepository = new NotificationRepository();
    }

    async getUserNotificationsById(id) {
        const userNotifications = await this.notificationRepository.getUserNotificationsById(id);

        return userNotifications;
    }

    async createNotification(notification) {
        const createdNotification = await this.notificationRepository.create(notification);

        return createdNotification;
    }

}

module.exports = NotificationService;
