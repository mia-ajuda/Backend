const HelpRepository = require("../repository/HelpRepository");

class HelpService {
  constructor() {
    this.HelpRepository = new HelpRepository();
  }

  async createHelp(data) {
    try {
      const createdHelp = await this.HelpRepository.create(data);

      return createdHelp;
    } catch (err) {
      throw err;
    }
  }

  async getHelpByid(id) {
    const Help = await this.HelpRepository.getById(id);

    if (!Help) {
      throw new Error("Pedido de ajuda não encontrado");
    }

    return Help;
  }

  async getHelpList(id, status, except, helper) {
    const Helplist = await this.HelpRepository.list(id, status, except, helper);
    if (!Helplist) {
      throw new Error("Pedidos de ajuda não encontrados");
    }

    return Helplist;
  }

  async getHelpListByStatus(id, status) {
    const Helplist = await this.HelpRepository.listByStatus(id, status);
    if (!Helplist) {
      throw new Error("Pedidos de ajuda não encontrados");
    }

    return Helplist;
  }

  async getNearHelpList(coords) {
    const Helplist = await this.HelpRepository.listNear(coords);
    if (!Helplist) {
      throw new Error(
        "Pedidos de ajuda não encontrados no seu raio de distância"
      );
    }

    return Helplist;
  }
}

module.exports = HelpService;
