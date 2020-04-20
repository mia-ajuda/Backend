const HelpRepository = require("../repository/HelpRepository");
const UserService = require("./UserService");
const notify = require("../utils/Notification")

class HelpService {
  constructor() {
    this.HelpRepository = new HelpRepository();
    this.UserService = new UserService();
  }

  async createHelp(data) {
    try {
      const countHelp = await this.HelpRepository.countDocuments(data.ownerId);
      if (countHelp >= 5) {
        throw " Limite máximo de pedidos atingido";
      }

      const createdHelp = await this.HelpRepository.create(data);
      return createdHelp;
    } catch (err) {
      throw err;
    }
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
    const help = await this.getHelpByid(id);

    help.active = false;

    await this.HelpRepository.update(help);

    return { message: `Help ${id} deleted!` };
  }

  async chooseHelper(data) {
    const help = await this.getHelpByid(data.idHelp);
    if (!help) {
      throw "Ajuda não encontrada";
    }
    if (help.helperId) {
      throw "Ajuda já possui ajudante";
    }

    const userPosition = help.possibleHelpers.indexOf(data.idHelper);
    if (userPosition >= 0) {
      help.helperId = data.idHelper;
      const result = await this.HelpRepository.update(help);
      return result;
    }
    throw "Ajudante não encontrado";
  }

  async helperConfirmation(data) {
    const help = await this.getHelpByid(data.helpId);
    const owner = await this.UserService.getUser({id: help.ownerId})
    
    if (!help) {
      throw "Ajuda não encontrada";
    } else if (help.helperId != data.helperId) {
      throw "Usuário não é o ajudante dessa ajuda";
    } else if (help.status == "owner_finished") {
      let messages = []
      const message = {
        to: owner.deviceId,
        sound: 'default',
        title: 'Pedido de ajuda finalizado!',
        body: 'Seu pedido ' + help.title + ' foi finalizado',
        data: { Pedido: help.description },
        _displayInForeground: true
      }
      messages.push(message)
      try {
        notify(messages)
      } catch (err) {
        console.log(err)
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
    const owner = await this.UserService.getUser({id: help.ownerId})
    if (!help) {
      throw "Ajuda não encontrada";
    } else if (help.ownerId != data.ownerId) {
      throw "Usuário não é o dono da ajuda";
    } else if (help.status == "helper_finished") {
      let messages = []
      const message = {
        to: owner.deviceId,
        sound: 'default',
        title: 'Pedido de ajuda finalizado!',
        body: 'Seu pedido ' + help.title + ' foi finalizado',
        data: { Pedido: help.description },
        _displayInForeground: true
      }
      messages.push(message)
      try {
        notify(messages)
      } catch (err) {
        console.log(err)
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
    let messages = []

    const message = {
      to: owner.deviceId,
      sound: 'default',
      title: helper.name + ' quer te ajudar!',
      body: 'Seu pedido ' + help.title + ' recebeu uma oferta de ajuda!',
      data: { Pedido: help.description },
      _displayInForeground: true
    }
    messages.push(message)
    try {
      notify(messages)
    } catch (err) {
      console.log(err)
    }

    const result = await this.HelpRepository.update(help);

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
