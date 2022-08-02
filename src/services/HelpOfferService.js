const { ObjectID } = require('mongodb');
const OfferedHelpRepository = require('../repository/HelpOfferRepository');
const UserService = require('./UserService');
const EntityService = require('./EntityService');
const NotificationService = require('./NotificationService');
const NotificationMixin = require('../utils/NotificationMixin');
const { notificationTypesEnum } = require('../models/Notification');
const saveError = require('../utils/ErrorHistory');
const { findConnections, sendMessage } = require('../../websocket');

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
      offeredHelpInfo,
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

  async listHelpsOffers(userId, isUserEntity, categoryArray, getOtherUsers) {
    const helpOffers = await this.OfferedHelpRepository.list(userId, isUserEntity, categoryArray, getOtherUsers);
    return helpOffers;
  }

  async listHelpsOffersByOwnerId(ownerId) {
    const helpOffers = await this.OfferedHelpRepository.listByOwnerId(ownerId);
    return helpOffers;
  }

  async listHelpOffersByHelpedUserId(helpedUserId) {
    const helpOffers = await this.OfferedHelpRepository.listByHelpedUserId(
      helpedUserId,
    );
    return helpOffers;
  }

  validateOwnerAndHelpedUser(helpedId, helpOffer) {
    if (helpOffer.ownerId === helpedId) throw new Error('Dono não pode ser ajudado da própria oferta');
    else if (helpOffer.helpedUserId != null && helpOffer.helpedUserId.includes(helpedId)) throw new Error('Usuário já está sendo ajudado');
  }

  validateOwner(helpOffer, email) {
    if (helpOffer.user.email !== email) {
      throw new Error('Usuário não autorizado');
    }
  }

  isUserInPossibleHelpedUsers(helpedUser, helpOffer, helpedId) {
    if (!helpedUser.isEntity) return helpOffer.possibleHelpedUsers.includes(helpedId);
    return helpOffer.possibleEntities.includes(helpedId);
  }

  possibleInterestedArray(helpOffer, helpedUser) {
    if (helpedUser.isEntity) return helpOffer.possibleEntities;
    return helpOffer.possibleHelpedUsers;
  }

  async addPossibleHelpedUsers(helpedId, helpOfferId) {
    const helpOffer = await this.getHelpOfferById(helpOfferId);
    const helpedUser = await this.verifyUserEntity(helpedId);
    const possibleHelpedUser = this.possibleInterestedArray(helpOffer, helpedUser);

    // Validacao
    this.validateOwnerAndHelpedUser(helpedId, helpOffer);
    if (this.isUserInPossibleHelpedUsers(helpedUser, helpOffer, helpedId)) throw new Error('Usuário já é um possível ajudado');

    // Alteracao do array
    await this.useService(possibleHelpedUser, 'push', [helpedId]);
    await this.OfferedHelpRepository.update(helpOffer);

    // Notificação
    const ownerProjection = { deviceId: 1, _id: 0 };
    const { deviceId: ownerDeviceId } = await this.useService(this.UserService, 'findOneUserWithProjection', [helpOffer.ownerId, ownerProjection]);

    const title = `${helpedUser.name} quer sua ajuda!`;
    const body = `Sua oferta ${helpOffer.title} recebeu um interessado`;

    await this.sendHelpOfferNotification(
      ownerDeviceId,
      title,
      body,
      helpOffer.ownerId,
      helpOfferId,
      notificationTypesEnum.ofertaRequerida,
    );
  }

  async addHelpedUsers(helpedId, helpOfferId) {
    const helpOffer = await this.getHelpOfferById(helpOfferId);
    const helpedUser = await this.verifyUserEntity(helpedId);
    const interestedArray = this.possibleInterestedArray(helpOffer, helpedUser);

    // Validacao
    this.validateOwnerAndHelpedUser(helpedId, helpOffer);
    if (!this.isUserInPossibleHelpedUsers(helpedUser, helpOffer, helpedId)) throw new Error('Usuário não é um interessado na ajuda');

    // Alteracao do array
    await this.useService(helpOffer.helpedUserId, 'push', [helpedId]);
    await this.useService(interestedArray, 'pull', [helpedId]);
    await this.OfferedHelpRepository.update(helpOffer);

    // Notificacao
    const ownerProjection = { name: 1, _id: 0 };
    const { name: ownerName } = await this.useService(
      this.UserService,
      'findOneUserWithProjection',
      [helpOffer.ownerId, ownerProjection],
    );

    const title = `${ownerName} escolheu ajudar você!`;
    const body = `Você foi escolhido para ser ajudado na oferta ${helpOffer.title}`;

    await this.sendHelpOfferNotification(
      helpedUser.deviceId,
      title,
      body,
      helpedId,
      helpOfferId,
      notificationTypesEnum.ofertaAceita,
    );
  }

  async verifyUserEntity(helpedId) {
    let helpedUserProjection = {
      name: 1, deviceId: 1, cpf: 1, _id: 0,
    };
    let helpedUserName;

    helpedUserName = await this.useService(this.UserService, 'findOneUserWithProjection', [helpedId, helpedUserProjection]);
    if (helpedUserName == null) {
      helpedUserProjection = {
        name: 1, deviceId: 1, cnpj: 1, _id: 0,
      };
      helpedUserName = await this.useService(this.EntityService, 'findOneEntityWithProjection', [helpedId, helpedUserProjection]);
    }

    const isUserEntity = (!!helpedUserName.cnpj);
    return { name: helpedUserName.name, deviceId: helpedUserName.deviceId, isEntity: isUserEntity };
  }

  async sendHelpOfferNotification(deviceId, title, body, userId, helpOfferId, notificationType) {
    const notificationHistory = {
      userId,
      helpId: helpOfferId,
      isOffer: true,
      title,
      body,
      notificationType,
    };

    try {
      await this.NotificationMixin.sendNotification(
        deviceId,
        title,
        body,
      );
      await this.NotificationService.createNotification(notificationHistory);
    } catch (err) {
      console.log('Não foi possível enviar a notificação!');
      saveError(err);
    }
  }

  async getHelpOfferById(helpOfferId) {
    const helpOffer = await this.OfferedHelpRepository.getById(helpOfferId);
    return helpOffer;
  }

  async finishHelpOfferByOwner(helpOfferId, email) {
    const query = { _id: ObjectID(helpOfferId) };
    const helpOfferProjection = ['ownerId', 'categoryId', 'active'];
    const owner = {
      path: 'user',
      select: 'email',
    };
    let helpOffer = await this.OfferedHelpRepository.findOne(query, helpOfferProjection, owner);

    this.validateOwner(helpOffer, email);

    helpOffer = await this.OfferedHelpRepository.finishHelpOfferByOwner(helpOffer);

    const sendSocketMessageTo = findConnections(helpOffer.categoryId, helpOffer.ownerId.toString());
    sendMessage(sendSocketMessageTo, 'delete-help-offer', helpOfferId);
  }

  async getEmailByHelpOfferId(helpOfferId) {
    const ownerEmail = await this.OfferedHelpRepository.getEmailByHelpOfferId(helpOfferId);
    return ownerEmail;
  }

  async useService(service, functionName, params = []) {
    const serviceReturn = await service[functionName](...params);
    return serviceReturn;
  }
}

module.exports = OfferedHelpService;
