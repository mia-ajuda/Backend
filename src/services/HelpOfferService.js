const OfferedHelpRepository = require('../repository/HelpOfferRepository');

class OfferedHelpService {
  constructor() {
    this.OfferedHelpRepository = new OfferedHelpRepository();
  }

  async createNewHelpOffer(offeredHelpInfo) {
    const newOfferdHelp = await this.OfferedHelpRepository.create(offeredHelpInfo);
    return newOfferdHelp;
  }
}

module.exports = OfferedHelpService;
