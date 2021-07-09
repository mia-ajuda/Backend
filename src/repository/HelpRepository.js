// eslint-disable-next-line import/no-unresolved
const { ObjectID } = require('mongodb');
const BaseRepository = require('./BaseRepository');
const HelpSchema = require('../models/Help');
const sharedAgreggationInfo = require('../utils/sharedAggregationInfo');

const {
  getDistance,
  calculateDistance,
} = require('../utils/geolocation/calculateDistance');

class HelpRepository extends BaseRepository {
  constructor() {
    super(HelpSchema);
  }

  projectHelp(matchQuery) {
    const aggregation = [
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: 'user',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'user',
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
          path: '$user',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: 'entity',
          localField: 'possibleEntities',
          foreignField: '_id',
          as: 'possibleEntities',
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          categories: {
            _id: 1,
            name: 1,
          },
          user: {
            name: 1,
            riskGroup: 1,
            location: {
              coordinates: 1,
            },
          },
        },
      },
    ];
    return aggregation;
  }

  async create(help) {
    const result = await super.$save(help);
    const matchQuery = {
      _id: result._id,
    };

    const aggregation = this.projectHelp(matchQuery);
    aggregation[aggregation.length - 1].$project.ownerId = 1;
    aggregation[aggregation.length - 1].$project.category = {
      _id: 1,
    };

    const createdHelp = await super.$listAggregate(aggregation);
    return createdHelp[0];
  }

  async getById(id) {
    const help = await super.$getById(id);
    return help;
  }

  async getByIdWithAggregation(id) {
    const aggregation = [
      {
        $match: {
          _id: ObjectID(id),
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'possibleHelpers',
          foreignField: '_id',
          as: 'possibleHelpers',
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'user',
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
          path: '$user',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          _id: 1,
          ownerId: 1,
          description: 1,
          helperId: 1,
          status: 1,
          title: 1,
          user: {
            photo: 1,
            name: 1,
            phone: 1,
            birthday: 1,
            address: {
              city: 1,
            },
            location: {
              coordinates: 1,
            },
          },
          categories: {
            name: 1,
            _id: 1,
          },
          possibleHelpers: {
            _id: 1,
            photo: 1,
            name: 1,
            birthday: 1,
            phone: 1,
            address: {
              city: 1,
            },
          },
          possibleEntities: {
            _id: 1,
            photo: 1,
            name: 1,
            birthday: 1,
            address: {
              city: 1,
            },
          },
        },
      },
    ];
    const helpWithAggregation = await super.$listAggregate(aggregation);
    return helpWithAggregation[0];
  }

  async update(help) {
    await super.$update(help);
  }

  async shortList(coords, id, categoryArray) {
    const matchQuery = {};
    matchQuery.active = true;
    matchQuery.possibleHelpers = { $not: { $in: [ObjectID(id)] } };
    matchQuery.ownerId = { $not: { $in: [ObjectID(id)] } };
    matchQuery.status = 'waiting';

    if (categoryArray) {
      matchQuery.categoryId = {
        $in: categoryArray.map((categoryString) => ObjectID(categoryString)),
      };
    }

    const aggregation = this.projectHelp(matchQuery);
    aggregation[aggregation.length - 1].$project.ownerId = 1;
    aggregation[aggregation.length - 1].$project.description = 1;
    const helps = await super.$listAggregate(aggregation);

    const helpsWithDistance = helps.map((help) => {
      const coordinates = {
        latitude: coords[1],
        longitude: coords[0],
      };
      const helpCoords = {
        latitude: help.user.location.coordinates[1],
        longitude: help.user.location.coordinates[0],
      };
      help.distance = getDistance(coordinates, helpCoords);
      help.distanceValue = calculateDistance(coordinates, helpCoords);
      return help;
    });

    helpsWithDistance.sort((a, b) => {
      if (a.distanceValue < b.distanceValue) {
        return -1;
      }
      if (a.distanceValue > b.distanceValue) {
        return 1;
      }
      return 0;
    });
    return helpsWithDistance;
  }

  async countDocuments(id) {
    const query = {};
    query.ownerId = id;
    query.active = true;
    query.status = { $ne: 'finished' };
    const result = await super.$countDocuments(query);

    return result;
  }

  async listToExpire() {
    const date = new Date();
    date.setDate(date.getDate() - 14);

    // eslint-disable-next-line no-return-await
    return await super.$list({
      creationDate: { $lt: new Date(date) },
      active: true,
    });
  }

  async getHelpListByStatus(userId, statusList, helper) {
    const matchQuery = {
      status: {
        $in: [...statusList],
      },
      active: true,
    };
    let showPossibleHelpers;
    let possibleHelpersEntityArray = [];
    if (helper) {
      showPossibleHelpers = 0;
      matchQuery.$or = [
        {
          possibleHelpers: { $in: [ObjectID(userId)] },
        },
        {
          helperId: ObjectID(userId),
        },
      ];
    } else {
      showPossibleHelpers = 1;
      possibleHelpersEntityArray = [
        {
          $lookup: {
            from: 'user',
            localField: 'possibleHelpers',
            foreignField: '_id',
            as: 'possibleHelpers',
          },
        },
        {
          $lookup: {
            from: 'entity',
            localField: 'possibleEntities',
            foreignField: '_id',
            as: 'possibleEntities',
          },
        },
      ];
      helper = 0;
      matchQuery.ownerId = ObjectID(userId);
    }
    const aggregation = [
      {
        $match: matchQuery,
      },
      ...possibleHelpersEntityArray,
      ...sharedAgreggationInfo,
     ];
    // Caso seja os meus pedidos você quer ver os possíveis ajudantes e o helperId
    if (showPossibleHelpers) {
      aggregation[aggregation.length - 1].$project.possibleHelpers = {
        _id: 1,
        photo: 1,
        name: 1,
        birthday: 1,
        'address.city': 1,
      };
      aggregation[aggregation.length - 1].$project.possibleEntities = {
        _id: 1,
        photo: 1,
        name: 1,
        birthday: 1,
        'address.city': 1,
      };

      aggregation[aggregation.length - 1].$project.helperId = 1;
    } else {
      // É necessário as coordenadas para as minhas ofertas de ajuda.
      aggregation[aggregation.length - 1].$project.user.location = {
        coordinates: 1,
      };
    }
    const helpList = await super.$listAggregate(aggregation);
    return helpList;
  }

  async getHelpInfoById(helpId) {
    const matchQuery = {};
    matchQuery._id = ObjectID(helpId);
    const aggregation = [
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: 'user',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $project: {
          _id: 0,
          description: 1,
          user: {
            photo: 1,
            birthday: 1,
            address: {
              city: 1,
            },
          },
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: false,
        },
      },
    ];
    const helpInfo = await super.$listAggregate(aggregation);
    return helpInfo[0];
  }
}

module.exports = HelpRepository;
