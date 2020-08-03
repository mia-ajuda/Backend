const HelpService = require('../services/HelpService');
const UserService = require('../services/UserService');
const saveError = require('../utils/ErrorHistory');

class HelpController {
  constructor() {
    this.HelpService = new HelpService();
    this.UserService = new UserService();
  }

  async createHelp(req, res, next) {
    const data = {
      ...req.body,
    };

    try {
      const result = await this.HelpService.createHelp(data);
      res.status(201).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).send({ error: err.message });
      next();
    }
  }

  async getHelpById(req, res, next) {
    const { id } = req.params;

    try {
      const result = await this.HelpService.getHelpByid(id);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getHelpList(req, res, next) {
    const { id } = req.query;
    const coords = req.query.coords.split(',').map((coord) => Number(coord));
    const categoryArray = req.query.categoryId ? req.query.categoryId.split(',') : null;
    /* A requisição do Query é feita com o formato "34312ID12312,12312ID13213",
            sendo que não é aceito o formato "34312ID12312, 12312ID13213" com espaço */
    console.log(coords);
    console.log(categoryArray);
    console.log(req.query.categoryId);
    try {
      const result = await this.HelpService.getNearHelpList(
        coords,
        id,
        categoryArray,
      );
      res.status(200);
      res.json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getHelpListByStatus(req, res, next) {
    const { userId } = req.params;

    /* A lista de status deve vir numa query  separada por vírgulas
         * Ex.: (...)?statusList=on_going,finished
         */
    const statusList = req.query.statusList.split(',');

    // Por padrão é feito uma agregação procurando por um ownerId.
    // Caso queira procurar por um helperId é necessário uma query
    const helper = req.query.helper === 'true';

    try {
      const result = await this.HelpService.getHelpListByStatus({ userId, statusList, helper });
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async deleteHelpLogic(req, res, next) {
    const { id } = req.params;

    try {
      const result = await this.HelpService.deleteHelpLogically(id);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async helperConfirmation(req, res, next) {
    const data = { ...req.params };

    try {
      const result = await this.HelpService.helperConfirmation(data);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async ownerConfirmation(req, res, next) {
    const data = { ...req.params };

    try {
      const result = await this.HelpService.ownerConfirmation(data);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async chooseHelper(req, res, next) {
    const data = { ...req.params };

    try {
      await this.HelpService.chooseHelper(data);
      res.status(204).json();
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
    }
  }

  async addPossibleHelpers(req, res, next) {
    const id = req.params.idHelp;
    const { idHelper } = req.params;

    try {
      await this.HelpService.addPossibleHelpers(id, idHelper);
      res.status(204).json();
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getToExpireList(req, res, next) {
    try {
      const result = await this.HelpService.getListToDelete();
      res.status(200);
      res.json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }
}

module.exports = HelpController;
