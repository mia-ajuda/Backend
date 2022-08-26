const { notificationTypesEnum } = require('../models/Notification');
const NotificationRepository = require('../repository/NotificationRepository');
const notify = require('../utils/Notification');
const UserService = require('./UserService').default;

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

  async createAndSendNotifications(title, body) {
    const userService = new UserService();
    const users = await userService.getUsersWithDevice();

    const messages = [];
    const notifications = [];
    users.forEach((user) => {
      messages.push({
        to: user.deviceId,
        sound: 'default',
        title,
        body,
      });
      notifications.push({
        userId: user._id,
        title,
        body,
        notificationType: notificationTypesEnum.notificacaoManual,
      });
    });

    try {
      notify(messages);

      notifications.forEach(async (notification) => {
        await this.createNotification(notification);
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = NotificationService;
