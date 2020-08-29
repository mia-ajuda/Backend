const OfferedHelpRepository = require("../repository/HelpOfferRepository");

class OfferedHelpService {
  constructor() {
    this.OfferedHelpRepository = new OfferedHelpRepository();
  }

  async createNewHelpOffer(offeredHelpInfo) {
    const newOfferdHelp = await this.OfferedHelpRepository.create(
      offeredHelpInfo
    );
    return newOfferdHelp;
  }

  async listHelpsOffers(userId) {
    const helpOffers = await this.OfferedHelpRepository.list(userId);
    return helpOffers;
  }

  async listHelpsOffersByOwnerId(ownerId) {
    const helpOffers = await this.OfferedHelpRepository.listByOwnerId(ownerId);
    return helpOffers;
  }

  async listHelpOffersByHelpedUserId(helpedUserId) {
    const helpOffers = await this.OfferedHelpRepository.listByHelpedUserId(
      helpedUserId
    );
    return helpOffers;
  }

  async addPossibleHelpedUsers(helpedId, helpOfferId, description) {
    const helpOffer = await this.getHelpOfferById(helpOfferId);
    console.log("addPossibleHelpedUsers");
    console.log(helpOffer);
    helpOffer.possibleHelpedUsers.push({ userId: helpedId, description });
    await this.OfferedHelpRepository.update(helpOffer);
  }

  async getHelpOfferById(helpOfferId) {
    const helpOffer = await this.OfferedHelpRepository.getById(helpOfferId);
    return helpOffer;
  }
}

module.exports = OfferedHelpService;
