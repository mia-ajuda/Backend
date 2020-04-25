const NotificationRepository = require('../repository/NotificationRepository');

class NotificationService {
    constructor() {
        this.notificationRepository = new NotificationRepository();
    }

    async getUserNotificationsById(id) {
        const userNotifications = this.notificationRepository.getUserNotificationsById(id);

        return userNotifications;
    }

}

module.exports = NotificationService;
