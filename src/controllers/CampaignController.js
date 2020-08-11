const CampaignService = require("../services/CampaignService");
const saveError = require("../utils/ErrorHistory");

class CampaignController {
  constructor() {
    this.CampaignService = new CampaignService();
  }

  async createCampaign(req, res) {
    try {
      const newCampaign = await this.CampaignService.createNewCampaign(
        req.body
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

  async getCampaignListByStatus(req, res, next) {
    const { userId } = req.params;

    const statusList = req.query.statusList.split(",");

    try {
      const result = await this.CampaignService.getCampaignListByStatus({
        userId,
        statusList,
      });
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async listCampaignByOwnerId(req, res) {
    const { ownerId } = req.params;
    try {
      const campaign = await this.CampaignService.listCampaignByOwnerId(
        ownerId
      );
      return res.json(campaign);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async deleteCampaignLogic(req, res, next) {
    const { id } = req.params;

    try {
      const result = await this.CampaignService.deleteCampaignLogically(id);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async listCampaignNear(req, res, next) {
    const except = !!req.query["id.except"];
    const helper = !!req.query["id.helper"];
    const temp = except ? "except" : helper ? "helper" : null;
    const id = temp ? req.query[`id.${temp}`] : req.query.id;
    const categoryArray = req.query.categoryId
      ? req.query.categoryId.split(",")
      : null;

    const near = !!req.query.near;
    const coords = near
      ? req.query.coords.split(",").map((coord) => Number(coord))
      : null;

    try {
      let result;
      if (near) {
        result = await this.CampaignService.getNearCampaignList(
          coords,
          except,
          id,
          categoryArray
        );
      }
      res.status(200);
      res.json(result);
      next();
    } catch (err) {
      console.log(err);
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }
}

module.exports = CampaignController;
