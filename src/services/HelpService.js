const HelpRepository = require('../repository/HelpRepository');
const NotificationService = require('./NotificationService');
const { notificationTypesEnum } = require('../models/Notification');
const UserService = require('./UserService');
const CategoryService = require('./CategoryService');
const { findConnections, sendMessage } = require('../../websocket');
const NotificationMixin = require('../utils/NotificationMixin');
const helpStatusEnum = require('../utils/enums/helpStatusEnum');
const saveError = require('../utils/ErrorHistory');

class HelpService {
  constructor() {
    this.HelpRepository = new HelpRepository();
    this.UserService = new UserService();
    this.CategoryService = new CategoryService();
    this.NotificationService = new NotificationService();
    this.NotificationMixin = new NotificationMixin();
  }

  async createHelp(data) {
    const countHelp = await this.HelpRepository.countDocuments(data.ownerId);
    console.log(countHelp);
    if (countHelp >= 5) {
      throw new Error('Limite máximo de pedidos atingido');
    }

    await this.CategoryService.getCategoryByid(data.categoryId);

    const createdHelp = await this.HelpRepository.create(data);

    const sendSocketMessageTo = findConnections(
      createdHelp.categoryId,
      JSON.parse(JSON.stringify(createdHelp.ownerId)),
    );
    sendMessage(sendSocketMessageTo, 'new-help', createdHelp);

    return createdHelp;
  }

  async getHelpByid(id) {
    const Help = await this.HelpRepository.getById(id);

    if (!Help) {
      throw new Error('Ajuda não encontrada');
    }

    return Help;
  }

  async getHelpList(coords, id, categoryArray) {
    const Helplist = await this.HelpRepository.shortList(
      coords,
      id,
      categoryArray,
    );
    if (!Helplist) {
      throw new Error('Pedidos de ajuda não encontrados no seu raio de distância');
    }

    return Helplist;
  }

  async deleteHelpLogically(id) {
    let help = await this.getHelpByid(id);

    help.active = false;

    await this.HelpRepository.update(help);

    help = JSON.parse(JSON.stringify(help));
    const sendSocketMessageTo = findConnections(help.categoryId, JSON.parse(JSON.stringify(help.ownerId)));
    sendMessage(sendSocketMessageTo, 'delete-help', id);

    return { message: `Help ${id} deleted!` };
  }

  async getHelpListByStatus({ userId, statusList, helper = false }) {
    const checkHelpStatusExistence = statusList.filter((item) => !Object.values(helpStatusEnum).includes(item));

    if (checkHelpStatusExistence.length > 0) {
      throw new Error('Um dos status informados é ínvalido');
    }

    const helpList = await this.HelpRepository.getHelpListByStatus(userId, statusList, helper);

    return helpList;
  }

  async chooseHelper(data) {
    const { idHelper } = data;
    const help = await this.getHelpByid(data.idHelp);
    const { ownerId } = help;
    const helper = await this.UserService.getUser({ id: idHelper });
    const owner = await this.UserService.getUser({ id: ownerId });

    if (help.helperId) {
      throw new Error('Ajuda já possui ajudante');
    }

    const sendSocketMessageTo = findConnections(
      help.categoryId,
      JSON.parse(JSON.stringify(ownerId)),
    );
    sendMessage(sendSocketMessageTo, 'delete-help', help._id);

    const title = `${owner.name} aceitou sua oferta de ajuda!`;
    const body = `Sua oferta para ${help.title} foi aceita`;

    const userPosition = help.possibleHelpers.indexOf(data.idHelper);
    if (userPosition >= 0) {
      help.helperId = data.idHelper;
      help.status = 'on_going';
      help.possibleHelpers = [];
      const result = await this.HelpRepository.update(help);

      const notificationHistory = {
        userId: helper._id,
        helpId: help._id,
        title,
        body,
        notificationType: notificationTypesEnum.ajudaAceita,
      };

      try {
        await this.NotificationService.createNotification(notificationHistory);
        await this.NotificationMixin.sendNotification(helper.deviceId, title, body);
      } catch (err) {
        console.log('Não foi possível enviar a notificação!');
        saveError(err);
      }

      return result;
    }
    throw new Error('Ajudante não encontrado');
  }

  async helperConfirmation(data) {
    const help = await this.getHelpByid(data.helpId);
    const owner = await this.UserService.getUser({ id: help.ownerId });
    const helper = await this.UserService.getUser({ id: help.helperId });

    if (help.helperId != data.helperId) {
      throw new Error('Usuário não é o ajudante dessa ajuda');
    } else if (help.status === 'owner_finished') {
      const ownerTitle = 'Pedido de ajuda finalizado!';
      const ownerBody = `Seu pedido ${help.title} foi finalizado`;

      const ownerNotificationHistory = {
        userId: help.ownerId,
        helpId: help._id,
        title: ownerTitle,
        body: ownerBody,
        notificationType: notificationTypesEnum.ajudaFinalizada,
      };

      const helperTitle = 'Oferta de ajuda finalizada!';
      const helperBody = `Sua oferta da ajuda ${help.title} foi finalizada`;
      const helperNotificationHistory = {
        userId: help.helperId,
        helpId: help._id,
        title: helperTitle,
        body: helperBody,
        notificationType: notificationTypesEnum.ajudaFinalizada,
      };

      try {
        await this.NotificationMixin.sendNotification(owner.deviceId, ownerTitle, ownerBody);
        await this.NotificationService.createNotification(ownerNotificationHistory);
        await this.NotificationMixin.sendNotification(helper.deviceId, helperTitle, helperBody);
        await this.NotificationService.createNotification(helperNotificationHistory);
      } catch (err) {
        console.log('Não foi possível enviar a notificação!');
        saveError(err);
      }

      help.status = 'finished';
    } else if (help.status === 'helper_finished') {
      throw new Error('Usuário já confirmou a finalização da ajuda');
    } else if (help.status === 'finished') {
      throw new Error('Ajuda já foi finalizada');
    } else {
      help.status = 'helper_finished';
    }

    const result = await this.HelpRepository.update(help);

    return result;
  }

  async ownerConfirmation(data) {
    const help = await this.getHelpByid(data.helpId);
    const owner = await this.UserService.getUser({ id: help.ownerId });
    const helper = await this.UserService.getUser({ id: help.helperId });

    if (help.ownerId != data.ownerId) {
      throw new Error('Usuário não é o dono da ajuda');
    } else if (help.status === 'helper_finished') {
      const ownerTitle = 'Pedido de ajuda finalizado!';
      const ownerBody = `Seu pedido ${help.title} foi finalizado`;

      const ownerNotificationHistory = {
        userId: help.ownerId,
        helpId: help._id,
        title: ownerTitle,
        body: ownerBody,
        notificationType: notificationTypesEnum.ajudaFinalizada,
      };

      const helperTitle = 'Oferta de ajuda finalizada!';
      const helperBody = `Sua oferta da ajuda ${help.title} foi finalizada`;
      const helperNotificationHistory = {
        userId: help.helperId,
        helpId: help._id,
        title: helperTitle,
        body: helperBody,
        notificationType: notificationTypesEnum.ajudaFinalizada,
      };

      try {
        await this.NotificationMixin.sendNotification(owner.deviceId, ownerTitle, ownerBody);
        await this.NotificationService.createNotification(ownerNotificationHistory);
        await this.NotificationMixin.sendNotification(helper.deviceId, helperTitle, helperBody);
        await this.NotificationService.createNotification(helperNotificationHistory);
      } catch (err) {
        console.log('Não foi possível enviar a notificação!');
        saveError(err);
      }

      help.status = 'finished';
    } else if (help.status === 'owner_finished') {
      throw new Error('Usuário já confirmou a finalização da ajuda');
    } else if (help.status === 'finished') {
      throw new Error('Essa ajuda já foi finalizada');
    } else {
      help.status = 'owner_finished';
    }

    const result = await this.HelpRepository.update(help);
    return result;
  }

  async addPossibleHelpers(id, idHelper) {
    const help = await this.getHelpByid(id);
    const owner = await this.UserService.getUser({ id: help.ownerId });

    if (idHelper == help.ownerId) {
      throw new Error('Você não pode ser ajudante de sua própria ajuda');
    }
    if (help.helperId) {
      throw new Error('Ajuda já possui ajudante');
    }

    const helper = await this.UserService.getUser({ id: idHelper });
    const userPosition = help.possibleHelpers.indexOf(idHelper);

    if (userPosition > -1) {
      throw new Error('Usuário já é um possível ajudante');
    }

    help.possibleHelpers.push(idHelper);

    const result = await this.HelpRepository.update(help);

    const title = `${helper.name} quer te ajudar!`;
    const body = `Seu pedido ${help.title} recebeu uma oferta de ajuda`;

    const notificationHistory = {
      userId: help.ownerId,
      helpId: help._id,
      title,
      body,
      notificationType: notificationTypesEnum.ajudaRecebida,
    };

    try {
      await this.NotificationMixin.sendNotification(owner.deviceId, title, body);
      await this.NotificationService.createNotification(notificationHistory);
    } catch (err) {
      console.log('Não foi possível enviar a notificação!');
      saveError(err);
    }

    return result;
  }

  async getListToDelete() {
    const Helplist = await this.HelpRepository.listToExpire();
    if (!Helplist) {
      throw new Error('Pedidos de ajuda não encontrados');
    }

    return Helplist;
  }
}

module.exports = HelpService;
