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
  
  async update(helpOffer) {
    await super.$update(helpOffer);
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
          localField: 'possibleHelpedUsers',
          foreignField: '_id',
          as: 'possibleHelpedUsers',
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
          user: {
            photo: 1,
            location: 1,
            name: 1,
            phone: 1,
            birthday: 1,
            address: 1,
          },
          title: 1,
          categories: {
            _id: 1,
            name: 1,
          },
          description: 1,
          status: 1,
          ownerId: 1,
        },
      },
    ];

    const helpOfferWithAggregation = await super.$listAggregate(aggregation);
    return helpOfferWithAggregation[0];
  }

  async list(userId, categoryArray,getOtherUsers) {
    const matchQuery = {};
    matchQuery.active = true;
    if(!getOtherUsers){
      matchQuery.possibleHelpedUsers = { $not: { $in: [ObjectID(userId)] } };
      matchQuery.ownerId = { $ne :ObjectID(userId) };
    } else{
      matchQuery.ownerId = { $eq :ObjectID(userId) };
    }
    
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
          'user.birthday': 1
        },
      },
    ];
    const helpOffers = await super.$listAggregate(aggregate);
    return helpOffers;
  }

  async listByOwnerId(ownerId) {
    const query = { ownerId };
    const helpOffers = await super.$list(query);
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
