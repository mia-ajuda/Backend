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

    try {
      notify(messages);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = NotificationService;
