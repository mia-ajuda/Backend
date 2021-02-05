const HelpOfferService = require("../services/HelpOfferService");
const saveError = require("../utils/ErrorHistory");

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
    console.log(userId);
    try {
      const helpOffers = await this.HelpOfferService.listHelpsOffers(userId);
      return res.json(helpOffers);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async listHelpOffersByOwnerId(req, res) {
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

  async addPossibleHelpedUsers(req, res) {
    const { helpedId, helpOfferId } = req.params;
    try {
      await this.HelpOfferService.addPossibleHelpedUsers(helpedId, helpOfferId);
      return res.status(204).json();
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async chooseHelpedUser(req, res) {}

  async finishHelpOfferByOwner(req, res) {
    const { helpOfferId } = req.params;
    const { email } = req.decodedToken;

    try {
      await this.HelpOfferService.finishHelpOfferByOwner(helpOfferId, email);
      return res.status(204).json();
    } catch (error) {
      saveError(error);
      return res.status(400).send({ error: error.message });
    }
  }
}

module.exports = OfferedHelpController;
