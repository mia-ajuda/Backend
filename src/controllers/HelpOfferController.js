const HelpOfferService = require('../services/HelpOfferService');

class OfferedHelpController {
  constructor() {
    this.HelpOfferService = new HelpOfferService();
  }

  async createHelpOffer(req, res) {
    try {
      const newHelpOffer = await this.HelpOfferService.createNewHelpOffer(
        req.body,
      );
      return res.json(newHelpOffer);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listOffer(req, res) {
    try {
      const helps = await this.HelpOfferService.listHelps();
      return res.json(helps);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async listOfferByOwnerId(req, res) {
    const { ownerId } = req.params;
    try {
      const helps = await this.HelpOfferService.listHelpsByOwnerId(ownerId);
      return res.json(helps);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async listOfferByHelpedUserId(req, res) {
    const { helpedUserId } = req.params;
    try {
      const helps = await this.HelpOfferService.listHelpsByHelpedUserId(helpedUserId);
      return res.json(helps);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async addPossibleHelpedUsers(req, res) {
    const { helpedId, helpOfferId } = req.params;
    try {
      await this.HelpOfferService.addPossibleHelpedHelpers(helpedId, helpOfferId);
      return res.status(204).json();
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async chooseHelpedUser(req, res) {}

  async finishHelpOfferByOwner(req, res) {

  }
}

module.exports = OfferedHelpController;
