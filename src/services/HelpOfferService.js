const OfferedHelpRepository = require("../repository/HelpOfferRepository");
const UserService = require("./UserService");
const EntityService = require("./EntityService");
const NotificationService = require("./NotificationService");
const NotificationMixin = require("../utils/NotificationMixin");
const isEntity = require('../utils/IsEntity');
const { notificationTypesEnum } = require("../models/Notification");
const saveError = require('../utils/ErrorHistory');

class OfferedHelpService {
  constructor() {
    this.OfferedHelpRepository = new OfferedHelpRepository();
    this.UserService = new UserService();
    this.NotificationService = new NotificationService();
    this.NotificationMixin = new NotificationMixin();
    this.EntityService = new EntityService();
  }

  async createNewHelpOffer(offeredHelpInfo) {
    const newOfferdHelp = await this.OfferedHelpRepository.create(
      offeredHelpInfo
    );
    return newOfferdHelp;
  }

  async getHelpOfferWithAggregationById(id) {
    const help = await this.OfferedHelpRepository.getByIdWithAggregation(id);

    if (!help) {
      throw new Error('Oferta não encontrada');
    }

    return help;
  }

  async listHelpsOffers(userId, categoryArray, getOtherUsers) {
    const helpOffers = await this.OfferedHelpRepository.list(userId, categoryArray, getOtherUsers);
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

  async putUserInArray(array, userId) {
    await this.useService(array, "push", [userId]);
  }

  validateOwnerAndHelpedUser(helpedId, helpOffer) {
    if (helpOffer.ownerId == helpedId)
      throw new Error("Dono não pode ser ajudado da própria oferta");
    else if (helpOffer.helpedUserId != null && helpOffer.helpedUserId.includes(helpedId))
      throw new Error("Usuário já está sendo ajudado");
  }

  isUserInPossibleHelpedUsers(helpedUser) {
    let isUserPossibleHelped;

    if (!helpedUser.isEntity) {
      isUserPossibleHelped = helpOffer.possibleHelpedUsers.includes(helpedId)
    }
    else {
      isUserPossibleHelped = helpOffer.possibleEntities.includes(helpedId)
    }
    return isUserPossibleHelped;
  }

  possibleInterestedArray(helpOffer, helpedUser){
    if(helpedUser.isEntity)
      return helpOffer.possibleEntities
    else
      return helpOffer.possibleHelpedUser
  }

  async addPossibleHelpedUsers(helpedId, helpOfferId) {
    const helpOffer = await this.getHelpOfferById(helpOfferId);
    const helpedUser = await this.verifyUserEntity(helpedId);
    const possibleHelpedUser = this.possibleInterestedArray(helpOffer, helpedUser)

    // Validacao
    this.validateOwnerAndHelpedUser(helpedId, helpOffer)
    if (this.isUserInPossibleHelpedUsers(helpedUser))
      throw new Error("Usuário já é um possível ajudado");

    // Alteracao do array
    await this.putUserInArray(possibleHelpedUser, helpedId);
    await this.OfferedHelpRepository.update(helpOffer);

    //Notificação
    const ownerProjection = { deviceId: 1, _id: 0 };
    const { deviceId: ownerDeviceId } = await this.useService(this.UserService, "findOneUserWithProjection", [helpOffer.ownerId, ownerProjection]);

    const title = `${helpedUser.name} quer sua ajuda!`;
    const body = `Sua oferta ${helpOffer.title} recebeu um interessado`;

    await this.sendHelpOfferNotification(ownerDeviceId, title, body, ownerDeviceId, helpOfferId, notificationTypesEnum.ofertaRequerida);

  }

  async addHelpedUsers(helpedId, helpOfferId) {
    const helpOffer = await this.getHelpOfferById(helpOfferId);
    const helpedUser = await this.verifyUserEntity(helpedId);
    const interestedArray = this.possibleInterestedArray(helpOffer, helpedUser)

    // Validacao
    this.validateOwnerAndHelpedUser(helpedId, helpOffer)
    if (!this.isUserInPossibleHelpedUsers(helpedUser))
      throw new Error("Usuário não é um interessado na ajuda");

    // Alteracao do array
    await this.putUserInArray(helpOffer.helpedUserId, helpedId);
    await this.useService(interestedArray, "pull", [helpedId]);
    await this.OfferedHelpRepository.update(helpOffer);

    //Notificacao
    const ownerProjection = { name: 1, _id: 0 };
    const { name: ownerName } = await this.useService(this.UserService, "findOneUserWithProjection", [helpOffer.ownerId, ownerProjection]);

    const title = `${ownerName} escolheu ajudar você!`;
    const body = `Você foi escolhido para ser ajudado na oferta ${helpOffer.title}`;

    await this.sendHelpOfferNotification(helpedUser.deviceId, title, body, helpedId, helpOfferId, notificationTypesEnum.ofertaAceita);
  }

  async verifyUserEntity(helpedId) {
    let helpedUserProjection = { name: 1, deviceId: 1, cpf: 1, _id: 0 };
    let helpedUserName;

    helpedUserName = await this.useService(this.UserService, "findOneUserWithProjection", [helpedId, helpedUserProjection]);
    if (helpedUserName == null) {
      helpedUserProjection = { name: 1, deviceId: 1, cnpj: 1, _id: 0 };
      helpedUserName = await this.useService(this.EntityService, "findOneEntityWithProjection", [helpedId, helpedUserProjection]);
    }

    const isUserEntity = (helpedUserName.cnpj ? true : false);
    return { name: helpedUserName.name, deviceId: helpedUserName.deviceId, isEntity: isUserEntity };
  }

  async sendHelpOfferNotification(deviceId, title, body, userId, helpOfferId, notificationType) {
    const notificationHistory = {
      userId: userId,
      helpId: helpOfferId,
      isOffer: true,
      title,
      body,
      notificationType: notificationType,
    };

    try {
      await this.NotificationMixin.sendNotification(
        deviceId,
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

  async useService(service, functionName, params = []) {
    let functionReturn = await service[functionName](...params);
    return functionReturn;
  }
}

module.exports = OfferedHelpService;
