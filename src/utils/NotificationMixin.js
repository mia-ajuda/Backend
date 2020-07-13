const notify = require('./Notification');

class NotificationService {
  async sendNotification(deviceId = '', title = '', body = '') {
    const messages = [];

    const message = {
      to: deviceId,
      sound: 'default',
      title,
      body,
      _displayInForeground: true,
    };
    if (!message.to) {
      console.log('O usuário não possui deviceId');
      return;
    }
    messages.push(message);

    notify(messages);
  }
}

module.exports = NotificationService;
