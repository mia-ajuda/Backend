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
    const aggregation = [
      {
        $match: { _id: ObjectID(id) },
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
    const help = await super.$listAggregate(aggregation);
    return help[0];
  }

  async update(help) {
    const helpUpdated = await super.$update(help);
    return helpUpdated;
  }

  async list(id, status, except, helper, categoryArray) {
    const ownerId = except
      ? { $ne: ObjectID(id) }
      : helper
        ? null
        : ObjectID(id);
    const helperId = helper ? ObjectID(id) : null;
    const query = {};
    if (status) query.status = status;
    if (categoryArray) query.categoryId = { $in: categoryArray };
    if (helper) query.helperId = helperId;
    else query.ownerId = ownerId;

    const result = await super.$listAggregate([
      {
        $match: query,
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
        $addFields: {
          ageRisk: {
            $cond: [
              {
                $gt: [
                  {
                    $subtract: [
                      {
                        $year: '$$NOW',
                      },
                      {
                        $year: '$user.birthday',
                      },
                    ],
                  },
                  60,
                ],
              },
              1,
              0,
            ],
          },
          cardio: {
            $cond: [
              {
                $in: ['$user.riskGroup', [['doenCardio']]],
              },
              1,
              0,
            ],
          },
          risco: {
            $size: '$user.riskGroup',
          },
        },
      },
      {
        $sort: {
          ageRisk: -1,
          cardio: -1,
          risco: -1,
        },
      },
      {
        $project: {
          ageRisk: 0,
          cardio: 0,
          risco: 0,
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
        $lookup: {
          from: 'user',
          localField: 'possibleHelpers',
          foreignField: '_id',
          as: 'possibleHelpers',
        },
      },
    ]);
    return result;
  }

  async listNear(coords, except, id, categoryArray) {
    const query = {};
    const ownerId = except ? { $ne: id } : null;

    query._id = ownerId;

    const users = await UserSchema.find(query);
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
      {
        $lookup: {
          from: 'user',
          localField: 'possibleHelpers',
          foreignField: '_id',
          as: 'possibleHelpers',
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

    if (helper) {
      matchQuery.$or = [
        {
          possibleHelpers: { $in: [ObjectID(userId)] },
        },
        {
          helperId: ObjectID(userId),
        },
      ];
    } else {
      matchQuery.ownerId = ObjectID(userId);
    }
    const helpList = await super.$listAggregate([
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
    ]);
    return helpList;
  }
}

module.exports = HelpRepository;
