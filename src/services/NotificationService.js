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
    const notificationCreated = await this.notificationRepository.create(notification);

    return notificationCreated;
  }
}

module.exports = NotificationService;
