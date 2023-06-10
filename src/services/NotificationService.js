const { notificationTypesEnum } = require('../models/Notification');
const NotificationRepository = require('../repository/NotificationRepository');
const saveError = require('../utils/ErrorHistory');
const notify = require('../utils/Notification');
const buildLatLong = require('../utils/geolocation/buildLatLng');
const { getDistance } = require('../utils/geolocation/calculateDistance');
const UserService = require('./UserService');
const NotificationMixin = require('../utils/NotificationMixin');

class NotificationService {
  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.UserService = new UserService();
    this.NotificationMixin = new NotificationMixin();
  }

  async getUserNotificationsById(id) {
    const userNotifications = await this.notificationRepository.getUserNotificationsById(id);

    return userNotifications;
  }

  async createNotification(notification) {
    const notificationCreated = await this.notificationRepository.create(notification);

    return notificationCreated;
  }

  async notifyNearUsers(title, body, ownerId) {
    const users = await this.UserService.getUsersWithDevice({ fields: 'location deviceId' });
    const currentUser = await this.UserService.getUser({ id: ownerId });
    const usersWithLocation = users.filter((user) => !!user.location?.coordinates);
    const nearUsers = usersWithLocation.filter((user) => {
      const distance = getDistance(
        buildLatLong(currentUser.location.coordinates),
        buildLatLong(user.location.coordinates),
        false,
      );
      return distance < 5000000;
    });
    nearUsers.forEach((user) => {
      console.log(user._id.toString(), ownerId.toString());
      if (user._id.toString() !== ownerId.toString()) {
        this.notifyUser(user, title, body);
      }
    });
  }

  async notifyUser(user, title, body) {
    try {
      await this.NotificationMixin.sendNotification(
        user.deviceId,
        title,
        body,
      );
    } catch (err) {
      console.log('Não foi possível enviar a notificação!');
      saveError(err);
    }
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
