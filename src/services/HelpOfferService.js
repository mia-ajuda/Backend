const OfferedHelpRepository = require('../repository/HelpOfferRepository');

class OfferedHelpService {
  constructor() {
    this.OfferedHelpRepository = new OfferedHelpRepository();
  }

  async createNewHelpOffer(offeredHelpInfo) {
    const newOfferdHelp = await this.OfferedHelpRepository.create(
      offeredHelpInfo,
    );
    return newOfferdHelp;
  }

  async listHelps() {
    const helps = await this.OfferedHelpRepository.list();
    return helps;
  }

  async listHelpsByOwnerId(ownerId) {
    const helps = await this.OfferedHelpRepository.listByOwnerId(ownerId);
    return helps;
  }

  async listHelpsByHelpedUserId(helpedUserId) {
    const helps = await this.OfferedHelpRepository.listByHelpedUserId(helpedUserId);
    return helps;
  }
}

module.exports = OfferedHelpService;
