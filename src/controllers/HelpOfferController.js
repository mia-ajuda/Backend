const HelpOfferService = require('../services/HelpOfferService');

class OfferedHelpController {
  constructor() {
    this.HelpOfferService = new HelpOfferService();
  }

  async createHelpOffer(req, res) {
    try {
      const newHelpOffer = await this.HelpOfferService.createNewHelpOffer(req.body);
      return res.json(newHelpOffer);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = OfferedHelpController;
