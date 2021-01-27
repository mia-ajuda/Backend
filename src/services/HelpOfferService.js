const OfferedHelpRepository = require("../repository/HelpOfferRepository");
const UserService = require("./UserService");
const NotificationService = require("./NotificationService");
const NotificationMixin = require("../utils/NotificationMixin");
const { notificationTypesEnum } = require("../models/Notification");
const saveError = require('../utils/ErrorHistory');

class OfferedHelpService {
  constructor() {
    this.OfferedHelpRepository = new OfferedHelpRepository();
    this.UserService = new UserService();
    this.NotificationService = new NotificationService();
    this.NotificationMixin = new NotificationMixin();
  }

  async createNewHelpOffer(offeredHelpInfo) {
    const newOfferdHelp = await this.OfferedHelpRepository.create(
      offeredHelpInfo
    );
    return newOfferdHelp;
  }

  async listHelpsOffers(userId, categoryArray) {
    const helpOffers = await this.OfferedHelpRepository.list(userId, categoryArray);
    return helpOffers;
  }

  async listHelpsOffersByOwnerId(ownerId) {
    const helpOffers = await this.OfferedHelpRepository.listByOwnerId(ownerId);
    return helpOffers;
  }

  async listHelpOffersByHelpedUserId(helpedUserId) {
    const helpOffers = await this.OfferedHelpRepository.listByHelpedUserId(
      helpedUserId
    );
    return helpOffers;
  }

  async addPossibleHelpedUsers(helpedId, helpOfferId) {
    const helpOffer = await this.getHelpOfferById(helpOfferId);
    
    const userPosition = helpOffer.possibleHelpedUsers.indexOf(helpedId);
    if (userPosition > -1) {
      throw new Error("Usuário já é um possível ajudante");
    }

    helpOffer.possibleHelpedUsers.push(helpedId);
    await this.OfferedHelpRepository.update(helpOffer);
    
    const helpedUserProjection = {
      name: 1, 
      _id: 0
    }
   
    const { name: helpedUserName } = await this.UserService.findOneUserWithProjection(helpedId,helpedUserProjection);
  
    const ownerProjection = {
      deviceId: 1,
      _id: 0,
    }
    
    const { deviceId:ownerDeviceId } = await this.UserService.findOneUserWithProjection(helpOffer.ownerId,ownerProjection);  
    const title = `${helpedUserName} quer sua ajuda!`;
    const body = `Sua oferta ${helpOffer.title} recebeu um interessado`;

    const notificationHistory = {
      userId: helpOffer.ownerId,
      helpId: helpOffer._id,
      isOffer: true,
      title,
      body,
      notificationType: notificationTypesEnum.ofertaRequerida,
    };

    try {
      await this.NotificationMixin.sendNotification(
        ownerDeviceId,
        title,
        body
      );
      await this.NotificationService.createNotification(notificationHistory);
    } catch (err) {
      console.log("Não foi possível enviar a notificação!");
      saveError(err);
    }
  }

  async getHelpOfferById(helpOfferId) {
    const helpOffer = await this.OfferedHelpRepository.getById(helpOfferId);
    return helpOffer;
  }

  async finishHelpOfferByOwner(helpOfferId, email) {
    const ownerEmail = await this.getEmailByHelpOfferId(
      helpOfferId,
    );

    if (ownerEmail !== email) {
      throw new Error('Usuário não autorizado');
    }

    this.OfferedHelpRepository.finishHelpOfferByOwner(helpOfferId);
  }

  async getEmailByHelpOfferId(helpOfferId) {
    const ownerEmail = await this.OfferedHelpRepository.getEmailByHelpOfferId(helpOfferId);
    return ownerEmail;
  }
}

module.exports = OfferedHelpService;
