const { notificationTypesEnum } = require('../models/Notification');
const NotificationRepository = require('../repository/NotificationRepository');
const NotificationMixin = require("../utils/NotificationMixin")
const UserService = require('./UserService');
const EntityService = require("./EntityService");
const notify = require('../utils/Notification');

class NotificationService {
  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.NotificationMixin = new NotificationMixin();
    this.EntityService = new EntityService();
    this.UserService = new UserService();
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


  async formatNotification(notificationHistory, account, help){
    const userPosition = help.possibleHelpers.indexOf(account.notificationReceiverId);
    const entityPosition = help.possibleEntities.indexOf(account.notificationReceiverId);

    if (userPosition >= 0) {
      notificationHistory.entityId = account.deviceId;
    } else if(entityPosition < 0) {
      notificationHistory.userId = account.deviceId;
    } else {
      throw new Error('Ajudante não encontrado');
    }
    console.log(account.deviceId);
    try {
      await this.createNotification(notificationHistory);
      await this.NotificationMixin.sendNotification(
        account.deviceId,
        title,
        body
      );
    } catch (err) {
      console.log("Não foi possível enviar a notificação!");
      console.log(err);
      //saveError(err);
    }
  
  }

  async chooseAccountToSendNotification(helperId,ownerId,sendToOwner){
    let account,userName;
    if(sendToOwner){
        const ownerProjection = { deviceId: 1, _id: 0 };
        let owner;
        owner = await this.UserService.findOneUserWithProjection(ownerId,ownerProjection);
        
        if(!owner){
          // nao tem essa funcao na entity ainda
          owner = await this.EntityService.findOneUserWithProjection(ownerId,ownerProjection);
          if(!owner){
            throw new Error('Usuário não encontrado');
          }
        }
        
        account = { id: ownerId, deviceId: owner.deviceId }
        const helperProjection = { name: 1,_id: 0 }
        const { name:helperName } = await this.UserService.findOneUserWithProjection(helperId,helperProjection);    
        
        if(!helperName){
          throw new Error('Usuário não encontrado');
        }
        userName = helperName;

    } else {
        const helperProjection = { deviceId: 1, _id: 0 };
        let helper;
        helper = await this.UserService.findOneUserWithProjection(helperId,helperProjection);
        
        if(!helper){
          // nao tem essa funcao na entity ainda
          helper = await this.EntityService.findOneUserWithProjection(helperId,helperProjection);
          if(!helper){
            throw new Error('Usuário não encontrado');
          }
        }

        account = { id: helperId, deviceId: helper.deviceId }
        const ownerProjection = { name: 1,_id: 0 }
        const { name:ownerName } = await this.UserService.findOneUserWithProjection(ownerId,ownerProjection);    
        
        if(!ownerName){
          throw new Error('Usuário não encontrado');
        }
        userName = ownerName;
    }
    
    return [account,userName];

  }



}

module.exports = NotificationService;
