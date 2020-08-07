const CampaignRepository = require('../repository/CampaignRepository');

class CampaignService {
  constructor() {
    this.CampaignRepository = new CampaignRepository();
  }

  async createNewCampaign(campaignInfo) {
    const newOfferdHelp = await this.CampaignRepository.create(
      campaignInfo,
    );
    return newOfferdHelp;
  }

  async listHelpsOffers() {
    const campaign = await this.CampaignRepository.list();
    return campaign;
  }

  async listHelpsOffersByOwnerId(ownerId) {
    const campaign = await this.CampaignRepository.listByOwnerId(ownerId);
    return campaign;
  }

  async listCampaignsByHelpedUserId(helpedUserId) {
    const campaign = await this.CampaignRepository.listByHelpedUserId(helpedUserId);
    return campaign;
  }

//   async addPossibleHelpedUsers(helpedId, campaignId) {
//     const campaign = await this.getCampaignById(campaignId);
//     campaign.possibleHelpedUsers.push(helpedId);
//     await this.CampaignRepository.update(campaign);
//   }

  async getCampaignById(campaignId) {
    const campaign = await this.CampaignRepository.getById(campaignId);
    return campaign;
  }
}

module.exports = CampaignService;
