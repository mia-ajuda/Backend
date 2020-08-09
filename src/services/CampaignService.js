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

  async listCampaign() {
    const campaign = await this.CampaignRepository.list();
    return campaign;
  }
  async getCampaignList(id, status, category, except, helper) {
    const CampaignList = await this.CampaignRepository.list(
      id,
      status,
      category,
      except,
      helper,
    );
    if (!CampaignList) {
      throw new Error('Nenhuma Ajuda com esse status foi encontrada');
    }
    return CampaignList;
  }
  async getNearCampaignList(coords, except, id, categoryArray) {
    const CampaignList = await this.CampaignRepository.listNear(
      coords,
      except,
      id,
      categoryArray,
    );
    // console.log('CampaignList ---------------------------> ',CampaignList);
    if (!CampaignList) {
      throw new Error('Nenhuma campanha foi encontrada no seu raio de distância');
    }

    return CampaignList;
  }

  async listCampaignByOwnerId(ownerId) {
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
