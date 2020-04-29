const BaseRepository = require("./BaseRepository");
const HelpSchema = require("../models/Help");
const UserSchema = require("../models/User");
const ObjectId = require("mongodb").ObjectID;
const { getDistance } = require("../utils/geolocation/calculateDistance");

class HelpRepository extends BaseRepository {
  constructor() {
    super(HelpSchema);
  }

  async create(help) {
    const result = await super.$save(help);

    const aggregation = [
      {
        $match: { _id: result._id},
      },
      {
        $lookup: {
          from: "user",
          localField: "ownerId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "category",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
    ];

    const helps = await super.$listAggregate(aggregation)
    return helps[0]
  }

  async getById(id) {
    return await super.$getById(id);
  }

  async update(help) {
    return await super.$update(help);
  }

  async list(id, status, except, helper, categoryArray) {
    const ownerId = except ? { $ne: ObjectId(id) } : helper ? null : ObjectId(id);
    const helperId = helper ? ObjectId(id) : null;
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
            from: "user",
            localField: "ownerId",
            foreignField: "_id",
            as: "user",
            },
        },
        {
            '$unwind': {
            'path': '$user', 
            'preserveNullAndEmptyArrays': false
            }
        }, {
            '$addFields': {
            'ageRisk': {
                '$cond': [
                {
                    '$gt': [
                    {
                        '$subtract': [
                        {
                            '$year': '$$NOW'
                        }, {
                            '$year': '$user.birthday'
                        }
                        ]
                    }, 60
                    ]
                }, 1, 0
                ]
            }, 
            'cardio': {
                '$cond': [
                {
                    '$in': [
                    '$user.riskGroup', [
                        [
                        'doenCardio'
                        ]
                    ]
                    ]
                }, 1, 0
                ]
            }, 
            'risco': {
                '$size': '$user.riskGroup'
            }
            }
        }, {
            '$sort': {
            'ageRisk': -1, 
            'cardio': -1, 
            'risco': -1
            }
        }, {
            '$project': {
                'ageRisk': 0, 
                'cardio': 0, 
                'risco': 0
            }
        },
        {
            '$lookup': {
                'from': "category",
                'localField': "categoryId",
                'foreignField': "_id",
                'as': "category",
            },
        },
        {
            '$lookup': {
                'from': "user",
                'localField': "possibleHelpers",
                'foreignField': "_id",
                'as': "possibleHelpers",
            },
        },
    ]);
    return result;
  }

  async listNear(coords, except, id, categoryArray) {
    const query = {};
    const location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: coords,
        },
        $maxDistance: 2000,
      },
    };
    const ownerId = except ? { $ne: id } : null;

    query.location = location;
    query._id = ownerId;

    const users = await UserSchema.find(query);
    const arrayUsersId = users.map((user) => user._id);

    let matchQuery = {};

    matchQuery.active = true;
    matchQuery.possibleHelpers = { $not: { $in: [ObjectId(id)] } };
    matchQuery.ownerId = {
      $in: arrayUsersId,
    };
    matchQuery = {
      ...matchQuery,
      $or: [{ status: "waiting" }, { helperId: ObjectId(id) }],
    };

    if (categoryArray) {
      matchQuery.categoryId = {
        $in: categoryArray.map((categoryString) => ObjectId(categoryString)),
      };
    }
    const aggregation = [
        {
            $match: matchQuery,
        },
        {
            $lookup: {
            from: "user",
            localField: "ownerId",
            foreignField: "_id",
            as: "user",
            },
        },
        {
            '$unwind': {
            'path': '$user', 
            'preserveNullAndEmptyArrays': false
            }
        }, {
            '$addFields': {
            'ageRisk': {
                '$cond': [
                {
                    '$gt': [
                    {
                        '$subtract': [
                        {
                            '$year': '$$NOW'
                        }, {
                            '$year': '$user.birthday'
                        }
                        ]
                    }, 60
                    ]
                }, 1, 0
                ]
            }, 
            'cardio': {
                '$cond': [
                {
                    '$in': [
                    '$user.riskGroup', [
                        [
                        'doenCardio'
                        ]
                    ]
                    ]
                }, 1, 0
                ]
            }, 
            'risco': {
                '$size': '$user.riskGroup'
            }
            }
        }, {
            '$sort': {
                'ageRisk': -1, 
                'cardio': -1, 
                'risco': -1
            }
        }, {
            '$project': {
                'ageRisk': 0, 
                'cardio': 0, 
                'risco': 0
            }
        },
        {
            '$lookup': {
                'from': "category",
                'localField': "categoryId",
                'foreignField': "_id",
                'as': "category",
            },
        },
        {
            '$lookup': {
                'from': "user",
                'localField': "possibleHelpers",
                'foreignField': "_id",
                'as': "possibleHelpers",
            },
        },
    ];

    try {
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

        return help;
      });

      return helpsWithDistance;
    } catch (error) {
        throw error;
    }
  }

  async countDocuments(id) {
    const query = {};
    query.ownerId = id;
    query.active = true;
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
}

module.exports = HelpRepository;
