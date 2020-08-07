const CampaignService = require('../services/CampaignService');

class CampaignController {
  constructor() {
    this.CampaignService = new CampaignService();
  }

  async createCampaign(req, res) {
    try {
      const newCampaign = await this.CampaignService.createNewCampaign(
        req.body,
      );
      console.log(newCampaign);
      return res.json(newCampaign);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listCampaign(req, res) {
    try {
      const campaign = await this.CampaignService.listCampaign();
      return res.json(campaign);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async listCampaignByOwnerId(req, res) {
    const { ownerId } = req.params;
    try {
      const campaign = await this.CampaignService.listCampaignByOwnerId(ownerId);
      return res.json(campaign);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async listCampaignsByHelpedUserId(req, res) {
    const { helpedUserId } = req.params;
    try {
      const campaign = await this.CampaignService.listCampaignsByHelpedUserId(helpedUserId);
      return res.json(campaign);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

//   async addPossibleHelpedUsers(req, res) {
//     const { helpedId, helpOfferId } = req.params;
//     try {
//       await this.CampaignService.addPossibleHelpedUsers(helpedId, helpOfferId);
//       return res.status(204).json();
//     } catch (error) {
//       return res.status(400).json(error);
//     }
//   }
}

module.exports = CampaignController;
