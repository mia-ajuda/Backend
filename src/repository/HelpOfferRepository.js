const { ObjectID } = require("mongodb");
const BaseRepository = require("./BaseRepository");
const OfferedHelp = require("../models/HelpOffer");

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
    matchQuery.ownerId = { $ne: ObjectID(userId) };

    // matchQuery.possibleHelpedUsers.userId = {
    //   $not: { $in: [ObjectID(userId)] },
    // };

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
          from: "user",
          localField: "ownerId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "category",
          localField: "categoryId",
          foreignField: "_id",
          as: "categories",
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
          "user.name": 1,
          "user.address": 1,
          "user.location.coordinates": 1,
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

  async update(helpOffer) {
    await super.$update(helpOffer);
  }

  async getOfferByIdWithUsers(helpOfferId) {
    const aggregation = [
      {
        $match: {
          _id: ObjectID(helpOfferId),
        },
      },
      {
        $unwind: {
          path: "$possibleHelpedUsers",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "possibleHelpedUsers.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: "$_id",
          possibleHelpedUsers: { $push: "$possibleHelpedUsers" },
        },
      },
      {
        $project: {
          _id: 0,
          possibleHelpedUsers: 1,
        },
      },
    ];
    const [helpOffer] = await super.$listAggregate(aggregation);
    return helpOffer;
  }
}

module.exports = OfferdHelpRepository;
