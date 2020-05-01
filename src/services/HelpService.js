const HelpRepository = require("../repository/HelpRepository");
const NotificationService = require('./NotificationService');
const { notificationTypesEnum } = require('../models/Notification');
const UserService = require("./UserService");
const { findConnections, sendMessage } = require('../../websocket');
const NotificationMixin = require("../utils/NotificationMixin");

class HelpService {
  constructor() {
    this.HelpRepository = new HelpRepository();
    this.UserService = new UserService();
    this.NotificationService = new NotificationService();
    this.NotificationMixin = new NotificationMixin();
  }

  async createHelp(data) {
    const countHelp = await this.HelpRepository.countDocuments(data.ownerId);
    if (countHelp >= 5) {
      throw "Limite máximo de pedidos atingido";
    }

    const createdHelp = await this.HelpRepository.create(data);

    const user = await this.UserService.getUser({ id: createdHelp.ownerId });
    const userCoords = {
      longitude: user.location.coordinates[0],
      latitude: user.location.coordinates[1],
    };
    const sendSocketMessageTo = findConnections(
      userCoords,
      createdHelp.categoryId,
      JSON.parse(JSON.stringify(user._id))
    );
    sendMessage(sendSocketMessageTo, "new-help", createdHelp);

    return createdHelp;
  }

  async getHelpByid(id) {
    const Help = await this.HelpRepository.getById(id);

    if (!Help) {
      throw "Ajuda não encontrada";
    }

    return Help;
  }

  async getHelpList(id, status, category, except, helper) {
    const Helplist = await this.HelpRepository.list(
      id,
      status,
      category,
      except,
      helper
    );
    if (!Helplist) {
      throw "Nenhuma Ajuda com esse status foi encontrada";
    }

    return Helplist;
  }

  async getNearHelpList(coords, except, id, categoryArray) {
    const Helplist = await this.HelpRepository.listNear(
      coords,
      except,
      id,
      categoryArray
    );
    if (!Helplist) {
      throw new Error(
        "Pedidos de ajuda não encontrados no seu raio de distância"
      );
    }

    return Helplist;
  }

  async deleteHelpLogically(id) {
    let help = await this.getHelpByid(id);

    help.active = false;

    await this.HelpRepository.update(help);

    const user = await this.UserService.getUser({ id: help.ownerId })
    const userCoords = {
      longitude: user.location.coordinates[0],
      latitude: user.location.coordinates[1]
    }
    help = JSON.parse(JSON.stringify(help));
    const sendSocketMessageTo = findConnections(userCoords, help.categoryId, JSON.parse(JSON.stringify(user._id)))
    sendMessage(sendSocketMessageTo, 'delete-help', id)

    return { message: `Help ${id} deleted!` };
  }

  async chooseHelper(data) {
    const idHelper = data.idHelper;
    const help = await this.getHelpByid(data.idHelp);
    const ownerId = help.ownerId;
    const helper = await this.UserService.getUser({ id: idHelper });
    const owner = await this.UserService.getUser({ id: ownerId });
    if (!help) {
      throw "Ajuda não encontrada";
    }
    if (help.helperId) {
      throw "Ajuda já possui ajudante";
    }

    const title = owner.name + " aceitou sua oferta de ajuda!";
    const body = "Sua oferta para " + help.title + " foi aceita!";

    const userPosition = help.possibleHelpers.indexOf(data.idHelper);
    if (userPosition >= 0) {
      help.helperId = data.idHelper;
      help.status = "on_going";
      help.possibleHelpers = [];
      const result = await this.HelpRepository.update(help);
      const notificationHistory = {
        userId: helper.ownerId,
        helpId: help._id,
        title: title,
        body: body,
        notificationType: notificationTypesEnum.ajudaAceita,
      };
      try {
        this.NotificationService.createNotification(notificationHistory);
        this.NotificationMixin.sendNotification(helper.deviceId, title, body);
      } catch (err) {
        console.log("Não foi possível enviar a notificação!");
      }
      return result;
    }
    throw "Ajudante não encontrado";
  }

  async helperConfirmation(data) {
    const help = await this.getHelpByid(data.helpId);
    const owner = await this.UserService.getUser({ id: help.ownerId });

    if (!help) {
      throw "Ajuda não encontrada";
    } else if (help.helperId != data.helperId) {
      throw "Usuário não é o ajudante dessa ajuda";
    } else if (help.status == "owner_finished") {
      const title = "Pedido de ajuda finalizado!";
      const body = "Seu pedido " + help.title + " foi finalizado";

      const notificationHistory = {
        userId: help.ownerId,
        helpId: help._id,
        title: title,
        body: body,
        notificationType: notificationTypesEnum.ajudaFinalizada,
      };

      try {
        this.NotificationMixin.sendNotification(owner.deviceId, title, body);
        this.NotificationService.createNotification(notificationHistory);
      } catch (err) {
         console.log("Não foi possível enviar a notificação!");
      }

      help.status = "finished";
    } else if (help.status == "helper_finished") {
      throw "Usuário já confirmou a finalização da ajuda";
    } else if (help.status == "finished") {
      throw "Ajuda já foi finalizada";
    } else {
      help.status = "helper_finished";
    }

    const result = await this.HelpRepository.update(help);

    return result;
  }

  async ownerConfirmation(data) {
    const help = await this.getHelpByid(data.helpId);
    const owner = await this.UserService.getUser({ id: help.ownerId });
    if (!help) {
      throw "Ajuda não encontrada";
    } else if (help.ownerId != data.ownerId) {
      throw "Usuário não é o dono da ajuda";
    } else if (help.status == "helper_finished") {
      const title = "Pedido de ajuda finalizado!";
      const body = "Seu pedido " + help.title + " foi finalizado";

      const notificationHistory = {
        userId: help.ownerId,
        helpId: help._id,
        title: title,
        body: body,
        notificationType: notificationTypesEnum.ajudaFinalizada,
      };

      try {
        this.NotificationMixin.sendNotification(owner.deviceId, title, body);
        this.NotificationService.createNotification(notificationHistory);
      } catch (err) {
        console.log ("Não foi possível enviar a notificação!");
      }

      help.status = "finished";
    } else if (help.status == "owner_finished") {
      throw "Usuário já confirmou a finalização da ajuda";
    } else if (help.status == "finished") {
      throw "Essa ajuda já foi finalizada";
    } else {
      help.status = "owner_finished";
    }

    const result = await this.HelpRepository.update(help);
    return result;
  }

  async addPossibleHelpers(id, idHelper) {
    const help = await this.getHelpByid(id);
    const owner = await this.UserService.getUser({ id: help.ownerId });
    if (!help) {
      throw "Ajuda não encontrada";
    }
    if (idHelper == help.ownerId) {
      throw "Você não pode ser ajudante de sua própria ajuda";
    }

    const helper = await this.UserService.getUser({ id: idHelper });
    const userPosition = help.possibleHelpers.indexOf(idHelper);
    if (userPosition > -1) {
      throw "Usuário já é um possível ajudante";
    }

    help.possibleHelpers.push(idHelper);

    const result = await this.HelpRepository.update(help);

    const title = helper.name + " quer te ajudar!";
    const body = "Seu pedido " + help.title + " recebeu uma oferta de ajuda!";

    const notificationHistory = {
      userId: help.ownerId,
      helpId: help._id,
      title: title,
      body: body,
      notificationType: notificationTypesEnum.ajudaRecebida,
    };

    try {
      this.NotificationMixin.sendNotification(owner.deviceId, title, body);
      this.NotificationService.createNotification(notificationHistory);
    } catch (err) {
       console.log("Não foi possível enviar a notificação!");
    }

    return result;
  }

  async getListToDelete() {
    const Helplist = await this.HelpRepository.listToExpire();
    if (!Helplist) {
      throw new Error("Pedidos de ajuda não encontrados");
    }

    return Helplist;
  }
}

module.exports = HelpService;
