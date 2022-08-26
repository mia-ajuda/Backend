const nodeSchedule = require('node-schedule');
const HelpService = require('../services/HelpService');
const UserService = require('../services/UserService');
const NotificationService = require('../services/NotificationService');
const notify = require('./Notification');
const { notificationTypesEnum } = require('../models/Notification');

function dailySchedule() {
  const notificationService = new NotificationService();

  nodeSchedule.scheduleJob('* * 08,18 * * *', async () => {
    const helpService = new HelpService();
    const userService = new UserService();

    const helpsToDelete = await helpService.getListToDelete();
    if (!helpsToDelete.length) {
      return;
    }

    const messages = [];
    const notifications = [];
    helpsToDelete.forEach((help) => {
      const user = userService.getUser(help.ownerId);
      const message = {
        to: user.deviceId,
        sound: 'default',
        title: 'Pedido de ajuda expirado!',
        body: `Seu pedido ${help.title} expirou`,
        data: { Pedido: help.description },
      };

      const notificationHistory = {
        userId: help.ownerId,
        helpId: help._id,
        title: message.title,
        body: message.body,
        notificationType: notificationTypesEnum.ajudaExpirada,
      };

      notifications.push(notificationHistory);
      messages.push(message);
    });

    let iterator = 0;

    try {
      notify(messages);
    } catch (err) {
      console.log(err);
    }
    Promise.all(helpsToDelete.map(async (help) => {
      try {
        const messageDeleted = await helpService.deleteHelpLogically(help.id);
        await notificationService.createNotification(notifications[iterator]);
        iterator += 1;

        return messageDeleted;
      } catch (err) {
        throw err;
      }
    }));
  });
}

module.exports = dailySchedule;
