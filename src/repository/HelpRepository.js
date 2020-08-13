const { ObjectID } = require('mongodb');
const BaseRepository = require('./BaseRepository');
const HelpSchema = require('../models/Help');
const UserSchema = require('../models/User');
const { getDistance, calculateDistance } = require('../utils/geolocation/calculateDistance');

class HelpRepository extends BaseRepository {
  constructor() {
    super(HelpSchema);
  }

  async create(help) {
    const result = await super.$save(help);

    const aggregation = [
      {
        $match: { _id: result._id },
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
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: 'category',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
    ];

    const helps = await super.$listAggregate(aggregation);
    return helps[0];
  }

  async getById(id) {
    const help = await super.$getById(id);
    return help;
  }

  async update(help) {
    const helpUpdated = await super.$update(help);
    return helpUpdated;
  }

  async shortList(coords, id, categoryArray) {
    const query = {};
    const ownerId = { $ne: id };
    query._id = ownerId;
    const selectedFields = {
      _id: 1,
    };

    const users = await UserSchema.find(query, selectedFields);
    const arrayUsersId = users.map((user) => user._id);
    const matchQuery = {};

    matchQuery.active = true;
    matchQuery.possibleHelpers = { $not: { $in: [ObjectID(id)] } };
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
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          'category.name': 1,
          'user.name': 1,
          'user.riskGroup': 1,
          'user.location.coordinates': 1,
        },
      },
    ];
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
      } if (a.distanceValue > b.distanceValue) {
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
      helper = 0;
      matchQuery.ownerId = ObjectID(userId);
    }
    const aggregation = [
      {
        $match: matchQuery,
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
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          'user.photo': 1,
          'user.phone': 1,
          'user.name': 1,
          'user.birthday': 1,
          'user.address.city': 1,
          description: 1,
          status: 1,
          title: 1,
          'category.name': 1,
        },
      },
    ];
    //Caso seja os meus pedidos você quer ver os possíveis ajudantes e o helperId
    if (showPossibleHelpers) {
      aggregation[aggregation.length - 1].$project.possibleHelpers = {
        _id: 1,
        photo: 1,
        name: 1,
        birthday: 1,
        'address.city': 1,
      };
      aggregation[aggregation.length - 1].$project.helperId = 1;
    } else {
      //É necessário as coordenadas para as minhas ofertas de ajuda.
      aggregation[aggregation.length - 1].$project.user = {
        'location.coordinates': 1,
      };
    }
    const helpList = await super.$listAggregate(aggregation);
    return helpList;
  }

  async getHelpInfoById(helpId) {
    const matchQuery = {};
    console.log(helpId);
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
          'user.address.city': 1,
          'user.photo': 1,
          'user.birthday': 1,
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
    console.log(helpInfo[0].user.address);
    return helpInfo[0];
  }
}

module.exports = HelpRepository;
