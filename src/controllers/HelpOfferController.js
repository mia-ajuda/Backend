const HelpOfferService = require("../services/HelpOfferService");

class OfferedHelpController {
  constructor() {
    this.HelpOfferService = new HelpOfferService();
  }

  async createHelpOffer(req, res) {
    try {
      const newHelpOffer = await this.HelpOfferService.createNewHelpOffer(
        req.body
      );
      return res.json(newHelpOffer);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listHelpsOffers(req, res) {
    const { userId } = req.query;
    const categoryArray = req.query.categoryId ? req.query.categoryId.split(',') : null;
    try {
      const helpOffers = await this.HelpOfferService.listHelpsOffers(userId, categoryArray);
      return res.json(helpOffers);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async listHelpsOffersByOwnerId(req, res) {
    const { ownerId } = req.params;
    try {
      const helpOffers = await this.HelpOfferService.listHelpsOffersByOwnerId(
        ownerId
      );
      return res.json(helpOffers);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async listHelpOffersByHelpedUserId(req, res) {
    const { helpedUserId } = req.params;
    try {
      const helpOffers = await this.HelpOfferService.listHelpOffersByHelpedUserId(
        helpedUserId
      );
      return res.json(helpOffers);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async listPossibleHelpedUsers(req, res) {
    const { helpOfferId } = req.params;
    try {
      const helpOffers = await this.HelpOfferService.getOfferByIdWithUsers(
        helpOfferId
      );
      return res.json(helpOffers);
    } catch (error) {
      return res.status(400).json({ error: error.message || error });
    }
  }

  async addPossibleHelpedUsers(req, res) {
    const { helpedId, helpOfferId } = req.params;
    const { description } = req.body;
    try {
      await this.HelpOfferService.addPossibleHelpedUsers(
        helpedId,
        helpOfferId,
        description
      );
      return res.status(204).json();
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async chooseHelpedUser(req, res) {}

  async finishHelpOfferByOwner(req, res) {}
}

module.exports = OfferedHelpController;
