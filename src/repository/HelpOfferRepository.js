const { ObjectID } = require('mongodb');
const BaseRepository = require('./BaseRepository');
const OfferedHelp = require('../models/HelpOffer');

class OfferdHelpRepository extends BaseRepository {
  constructor() {
    super(OfferedHelp);
  }

  async create(offeredHelp) {
    const newOfferdHelp = await super.$save(offeredHelp);
    return newOfferdHelp;
  }

  async list(userId, categoryArray) {
    const matchQuery = {};
    matchQuery.userId = userId;

    if (categoryArray) {
      matchQuery.categoryId = {
        $in: categoryArray.map((category) => ObjectID(category)),
      };
    }
    const aggregate = [
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
          as: 'categories',
        },
      },
      {
        $sort: {
          creationDate: -1,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          categories: 1,
          ownerId: 1,
          'user.name': 1,
          'user.address': 1,
          'user.location.coordinates': 1,
          'user.birthday': 1,
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
    const helpOffers = await super.$listAggregate(aggregate);
    return helpOffers;
  }

  async update(help) {
    await super.$update(help);
  }

  async listByOwnerId(ownerId) {
    // "60480f7868547c0077bd2dbb"
    // ownerId = "5fc98569df03a7002e4a2b8f"
    ownerId = "60480f7868547c0077bd2dbb"
    const query = { ownerId };
    const aggregation = [
      {
        $match: {
          _id: ObjectID(ownerId),
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
      // {
      //   $unwind: {
      //     path: '$user',
      //     preserveNullAndEmptyArrays: false,
      //   },
      // },
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
    const helpOffers = await super.$listAggregate(aggregation);
    // const helpOffers = await super.$list(query);
    return helpOffers;
  }

  async listByHelpedUserId(helpedUserId) {
    const query = { helpedUserId };
    const helpOffers = await super.$list(query);
    return helpOffers;
  }

  async getById(id) {
    const helpOffer = await super.$getById(id);
    return helpOffer;
  }

  async finishHelpOfferByOwner(helpOfferId) {
    const filter = { _id: helpOfferId };
    const update = { active: false };

    await super.$findOneAndUpdate(filter, update);
  }

  async getEmailByHelpOfferId(helpOfferId) {
    const matchQuery = {};
    matchQuery._id = ObjectID(helpOfferId);

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
        $project: {
          _id: 0,
          user: {
            email: 1,
          },
        },
      },
    ];
    const helpOffer = await super.$listAggregate(aggregation);
    return helpOffer[0].user.email;
  }
}

module.exports = OfferdHelpRepository;
