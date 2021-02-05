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
    const helpOffers = await this.OfferedHelpRepository.list(
      userId,
    );
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

  async addPossibleHelpedUsers(helpedId, helpOfferId) {
    let helpOffer = await this.getHelpOfferById(helpOfferId);
    if (helpOffer.possibleHelpedUsers.find((value) => value == helpedId)) {
      console.log("Não é um erro 400");
      throw new Error("Usuário já se candidatou para essa oferta");
    }
    else {
      helpOffer.possibleHelpedUsers.push(helpedId);
      await this.OfferedHelpRepository.update(helpOffer);
    }
  }

  async getHelpOfferById(helpOfferId) {
    const helpOffer = await this.OfferedHelpRepository.getById(helpOfferId);
    return helpOffer;
  }

  async finishHelpOfferByOwner(helpOfferId, email) {
    const ownerEmail = await this.getEmailByHelpOfferId(helpOfferId);

    if (ownerEmail !== email) {
      throw new Error("Usuário não autorizado");
    }

    this.OfferedHelpRepository.finishHelpOfferByOwner(helpOfferId);
  }

  async getEmailByHelpOfferId(helpOfferId) {
    const ownerEmail = await this.OfferedHelpRepository.getEmailByHelpOfferId(
      helpOfferId
    );
    return ownerEmail;
  }
}

module.exports = OfferedHelpService;
