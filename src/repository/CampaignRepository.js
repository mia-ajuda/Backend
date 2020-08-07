const BaseRepository = require('./BaseRepository');
const Campaign = require('../models/Campaign');

class CampaignRepository extends BaseRepository {
  constructor() {
    super(Campaign);
  }

  async create(campaign) {
    const newCampaign = await super.$save(campaign);
    return newCampaign;
  }

  async list() {
    const query = null;
    const populate = 'user';
    const campaigns = await super.$list(query, populate);
    return campaigns;
  }

  async listByOwnerId(ownerId) {
    const query = { ownerId };
    const campaigns = await super.$list(query);
    return campaigns;
  }

  async getById(id) {
    const campaign = await super.$getById(id);
    return campaign;
  }

  async update(campaign) {
    await super.$update(campaign);
  }
}

module.exports = CampaignRepository;
