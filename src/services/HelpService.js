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

  async getHelpList(id, status, except, helper, categoryArray) {
    const Helplist = await this.HelpRepository.list(
      id,
      status,
      except,
      helper,
      categoryArray
    );
    if (!Helplist) {
      throw new Error("Pedidos de ajuda não encontrados");
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
}

module.exports = HelpService;
