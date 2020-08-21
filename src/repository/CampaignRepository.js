const { ObjectID } = require('mongodb');
const BaseRepository = require('./BaseRepository');
const Campaign = require('../models/Campaign');
const EntitySchema = require('../models/Entity');
const {
  getDistance,
  calculateDistance,
} = require('../utils/geolocation/calculateDistance');

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
    const populate = 'campaign';
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

  async listNear(coords, except, id, categoryArray) {
    const query = {};
    const ownerId = except ? { $ne: id } : null;
    query._id = ownerId;

    const users = await EntitySchema.find(query);
    const arrayUsersId = users.map((user) => user._id);

    const matchQuery = {};

    matchQuery.active = true;
    matchQuery.ownerId = {
      $in: arrayUsersId,
    };
    matchQuery.status = 'waiting';

    if (categoryArray) {
      matchQuery.categoryId = {
        $in: categoryArray.map((categoryString) => ObjectID(categoryString)),
      };
    }

    const aggregation = [
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: 'entity',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'entity',
        },
      },
      {
        $unwind: {
          path: '$entity',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: 'category',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categories',
        },
      },
    ];

    const campaigns = await super.$listAggregate(aggregation);
    const campaignsWithDistance = campaigns.map((campaign) => {
      const coordinates = {
        latitude: coords[1],
        longitude: coords[0],
      };

      const campaignCoords = {
        latitude: campaign.entity.location.coordinates[1],
        longitude: campaign.entity.location.coordinates[0],
      };

      campaign.distance = getDistance(coordinates, campaignCoords);
      campaign.distanceValue = calculateDistance(coordinates, campaignCoords);
      return campaign;
    });
    campaignsWithDistance.sort((a, b) => {
      if (a.distanceValue < b.distanceValue) {
        return -1;
      }
      if (a.distanceValue > b.distanceValue) {
        return 1;
      }
      return 0;
    });
    return campaignsWithDistance;
  }

  async getCampaignListByStatus(userId, statusList) {
    const matchQuery = {
      status: {
        $in: [...statusList],
      },
      active: true,
    };
    matchQuery.ownerId = ObjectID(userId);

    const campaign = await super.$listAggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: 'entity',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'entity',
        },
      },
      {
        $lookup: {
          from: 'category',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categories',
        },
      },
      {
        $unwind: {
          path: '$entity',
          preserveNullAndEmptyArrays: false,
        },
      },
    ]);
    return campaign;
  }
}

module.exports = CampaignRepository;
