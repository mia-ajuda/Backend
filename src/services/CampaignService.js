const CampaignRepository = require("../repository/CampaignRepository");
const { findConnections, sendMessage } = require("../../websocket");
const helpStatusEnum = require("../utils/enums/helpStatusEnum");

class CampaignService {
  constructor() {
    this.CampaignRepository = new CampaignRepository();
  }

  async createNewCampaign(campaignInfo) {
    const newOfferdHelp = await this.CampaignRepository.create(campaignInfo);
    return newOfferdHelp;
  }

  async listCampaign() {
    const campaign = await this.CampaignRepository.list();
    return campaign;
  }

  async getCampaignListByStatus({ userId, statusList }) {
    const checkHelpStatusExistence = statusList.filter(
      (item) => !Object.values(helpStatusEnum).includes(item)
    );

    if (checkHelpStatusExistence.length > 0) {
      throw new Error("Um dos status informados é ínvalido");
    }

    const helpList = await this.CampaignRepository.getCampaignListByStatus(
      userId,
      statusList
    );

    return helpList;
  }

  async getNearCampaignList(coords, except, id, categoryArray) {
    const CampaignList = await this.CampaignRepository.listNear(
      coords,
      except,
      id,
      categoryArray
    );
    if (!CampaignList) {
      throw new Error(
        "Nenhuma campanha foi encontrada no seu raio de distância"
      );
    }

    return CampaignList;
  }

  async deleteCampaignLogically(id) {
    let campaign = await this.getCampaignById(id);

    campaign.active = false;

    await this.CampaignRepository.update(campaign);

    campaign = JSON.parse(JSON.stringify(campaign));
    const sendSocketMessageTo = findConnections(
      campaign.categoryId,
      JSON.parse(JSON.stringify(campaign.ownerId))
    );
    sendMessage(sendSocketMessageTo, "delete-campaign", id);

    return { message: `Campaign ${id} deleted!` };
  }

  async listCampaignByOwnerId(ownerId) {
    const campaign = await this.CampaignRepository.listByOwnerId(ownerId);
    return campaign;
  }
}

module.exports = CampaignService;
