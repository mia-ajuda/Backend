const notify = require("./Notification");

class NotificationService {
  constructor() { }

  async sendNotification(deviceId = '', title = '', body = '') {
    let messages = []

    const message = {
      to: 'ExponentPushToken[r3lDLzOR1fp3QHG7aYZzDq]',
      sound: 'default',
      title: title,
      body: body,
      _displayInForeground: true
    }

    messages.push(message)
    
    try {
      notify(messages)
    } catch(err) {
    }
  }

}

module.exports = NotificationService