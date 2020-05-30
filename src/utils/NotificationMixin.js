const notify = require("./Notification");

class NotificationService {
  constructor() { }

  async sendNotification(deviceId = '', title = '', body = '') {
    let messages = []

    const message = {
      to: deviceId,
      sound: 'default',
      title: title,
      body: body,
      _displayInForeground: true
    }
    if(!message.to){
      console.log("O usuário não possui deviceId")
      return
    }
    messages.push(message)
    
    try {
      notify(messages)
    } catch(err) {
    }
  }

}

module.exports = NotificationService