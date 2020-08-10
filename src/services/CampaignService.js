const CampaignRepository = require('../repository/CampaignRepository');
const { findConnections, sendMessage } = require('../../websocket');

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
      throw new Error('Nenhuma campanha com esse status foi encontrada');
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
    if (!CampaignList) {
      throw new Error('Nenhuma campanha foi encontrada no seu raio de distância');
    }

    return CampaignList;
  }

  async deleteCampaignLogically(id) {
    let campaign = await this.getCampaignById(id);

    campaign.active = false;

    await this.CampaignRepository.update(campaign);

    campaign = JSON.parse(JSON.stringify(campaign));
    const sendSocketMessageTo = findConnections(campaign.categoryId, JSON.parse(JSON.stringify(campaign.ownerId)));
    sendMessage(sendSocketMessageTo, 'delete-campaign', id);

    return { message: `Campaign ${id} deleted!` };
  }
  
  async listCampaignByOwnerId(ownerId) {
    const campaign = await this.CampaignRepository.listByOwnerId(ownerId);
    return campaign;
  }
}

module.exports = CampaignService;
