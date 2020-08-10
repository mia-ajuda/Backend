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

  async listHelpsOffers(req, res) {
    try {
      const helpOffers = await this.HelpOfferService.listHelpsOffers();
      return res.json(helpOffers);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async listHelpsOffersByOwnerId(req, res) {
    const { ownerId } = req.params;
    try {
      const helpOffers = await this.HelpOfferService.listHelpsOffersByOwnerId(ownerId);
      return res.json(helpOffers);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async listHelpOffersByHelpedUserId(req, res) {
    const { helpedUserId } = req.params;
    try {
      const helpOffers = await this.HelpOfferService.listHelpOffersByHelpedUserId(helpedUserId);
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

  }

  async deleteHelpOffer(req, res) {
    try {
      const { helpId } = req.params;
      await this.HelpOfferService.deleteHelpOffer(helpId);
      return res.status(201).send();
    } catch (err) {
      return res.status(400).json({ message: err.message || err });
    }
  }
}

module.exports = OfferedHelpController;
