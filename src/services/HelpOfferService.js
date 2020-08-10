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

  async listHelpsOffers() {
    const helpOffers = await this.OfferedHelpRepository.list();
    return helpOffers;
  }

  async listHelpsOffersByOwnerId(ownerId) {
    const helpOffers = await this.OfferedHelpRepository.listByOwnerId(ownerId);
    return helpOffers;
  }

  async listHelpOffersByHelpedUserId(helpedUserId) {
    const helpOffers = await this.OfferedHelpRepository.listByHelpedUserId(helpedUserId);
    return helpOffers;
  }

  async addPossibleHelpedUsers(helpedId, helpOfferId) {
    const helpOffer = await this.getHelpOfferById(helpOfferId);
    helpOffer.possibleHelpedUsers.push(helpedId);
    await this.OfferedHelpRepository.update(helpOffer);
  }

  async getHelpOfferById(helpOfferId) {
    const helpOffer = await this.OfferedHelpRepository.getById(helpOfferId);
    return helpOffer;
  }

  async deleteHelpOffer(helpOfferId) {
    const helpOffer = await this.OfferedHelpRepository.getById(helpOfferId);

    if (!helpOffer) throw new Error('help not found');

    helpOffer.active = false;
    await this.OfferedHelpRepository.update(helpOffer);
  }
}

module.exports = OfferedHelpService;
