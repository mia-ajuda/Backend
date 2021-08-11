// eslint-disable-next-line import/no-unresolved
const { ObjectID } = require('mongodb');
const BaseRepository = require('./BaseRepository');
const HelpSchema = require('../models/Help');
const sharedAgreggationInfo = require('../utils/sharedAggregationInfo');

class HelpRepository extends BaseRepository {
  constructor() {
    super(HelpSchema);
  }

  async create(help) {
    const doc = await super.$save(help);
    const populate = [
      {
        path: 'user',
        select: ['name', 'riskGroup', 'location.coordinates']
      },
      {
        path: 'categories',
        select: ['name']
      }
    ]
    let result = await super.$populateExistingDoc(doc, populate);
    return {
      _id: result._id,
      ownerId: result.ownerId,
      title: result.title,
      categoryId: result.categoryId,
      categories: result.categories,
      user: result.user
    }
  }

  async getById(id) {
    const help = await super.$getById(id);
    return help;
  }

  async getByIdWithAggregation(id) {
    const matchQuery = { _id: ObjectID(id) };
    const helpFields = [
      '_id', 'ownerId', 'categoryId',
      'possibleHelpers', 'possibleEntities',
      'description', 'helperId', 'status', 'title'
    ];
    const user = {
      path: 'user',
      select: ['photo', 'name', 'phone', 'birthday', 'address.city', 'location.coordinates']
    }
    const categories = {
      path: 'categories',
      select: ['_id', 'name']
    }
    const possibleHelpers = {
      path: 'possibleHelpers',
      select: ['_id', 'name', 'phone', 'photo', 'birthday', 'address.city']
    }
    const possibleEntities = {
      path: 'possibleEntities',
      select: ['_id', 'name', 'photo', 'address.city']
    }
    return super.$findOne(
      matchQuery,
      helpFields,
      [user, categories, possibleHelpers, possibleEntities]
    );
  }

  async update(help) {
    await super.$update(help);
  }

  async shortList(coords, id, categoryArray) {
    const matchQuery = {
      active: true,
      possibleHelpers: { $not: { $in: [ObjectID(id)] } },
      ownerId: { $not: { $in: [ObjectID(id)] } },
      status: 'waiting'
    };

    if (categoryArray) {
      matchQuery.categoryId = {
        $in: categoryArray.map((categoryString) => ObjectID(categoryString)),
      };
    }
    const helpFields = ['_id', 'title', 'description', 'categoryId', 'ownerId'];
    const user = {
      path: 'user',
      select: ['name', 'riskGroup', 'location.coordinates']
    };
    const categories = {
      path: 'categories',
      select: ['_id', 'name']
    }
    const helps = await super.$list(matchQuery, helpFields, [user, categories])
    const helpsWithDistance = helps.map(help => {
      help.distances = { userCoords: help.user.location.coordinates, coords }
      return help.toObject();
    });

    helpsWithDistance.sort((a, b) => a.distanceValue - b.distanceValue);

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

    return super.$list({
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
    // let showPossibleHelpers;
    // let possibleHelpersEntityArray = [];
    let possibleHelpers = {};
    let possibleEntities = {};
    let user = {};
    let categories = {};
    let populate = [];
    let fields = [];
    if (helper) {
    //   showPossibleHelpers = 0;
    //   matchQuery.$or = [
    //     {
    //       possibleHelpers: { $in: [ObjectID(userId)] },
    //     },
    //     {
    //       helperId: ObjectID(userId),
    //     },
    //   ];
     } else {
       // showPossibleHelpers = 1;
       fields = ['_id', 'description', 'title', 'status', 'ownerId']
       possibleHelpers = {
         path: 'possibleHelpers',
         select: ['_id', 'photo', 'name', 'birthday', 'address.city']
       };
       possibleEntities = {
         path: 'possibleEntities',
         select: ['_id', 'photo', 'name', 'birthday', 'address.city']
       };
       user = {
         path: 'user',
         select: ['photo', 'phone', 'name', 'birthday', 'address.city']
       };
       categories = {
         path: 'categories',
         select: ['_id', 'name']
       };
       populate = [possibleHelpers, possibleEntities, user, categories];
    //   possibleHelpersEntityArray = [
    //     {
    //       $lookup: {
    //         from: 'user',
    //         localField: 'possibleHelpers',
    //         foreignField: '_id',
    //         as: 'possibleHelpers',
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: 'entity',
    //         localField: 'possibleEntities',
    //         foreignField: '_id',
    //         as: 'possibleEntities',
    //       },
    //     },
    //   ];
    //   helper = 0;
       matchQuery.ownerId = ObjectID(userId);
     }
    // const aggregation = [
    //   {
    //     $match: matchQuery,
    //   },
    //   ...possibleHelpersEntityArray,
    //   ...sharedAgreggationInfo,
    // ];
    // // Caso seja os meus pedidos você quer ver os possíveis ajudantes e o helperId
    // if (showPossibleHelpers) {
    //   aggregation[aggregation.length - 1].$project.possibleHelpers = {
    //     _id: 1,
    //     photo: 1,
    //     name: 1,
    //     birthday: 1,
    //     'address.city': 1,
    //   };
    //   aggregation[aggregation.length - 1].$project.possibleEntities = {
    //     _id: 1,
    //     photo: 1,
    //     name: 1,
    //     birthday: 1,
    //     'address.city': 1,
    //   };

    //   aggregation[aggregation.length - 1].$project.helperId = 1;
    // } else {
    //   // É necessário as coordenadas para as minhas ofertas de ajuda.
    //   aggregation[aggregation.length - 1].$project.user.location = {
    //     coordinates: 1,
    //   };
    // }
    // const helpList = await super.$listAggregate(aggregation);
    const helpList = await super.$list(matchQuery, fields, populate);
    return helpList;
  }

  async getHelpInfoById(helpId) {
    const matchQuery = { _id: ObjectID(helpId) };

    const populate = {
      path: 'user',
      select: ['photo', 'birthday', 'address.city']
    }

    const projection = {
      description: 1,
      _id: 0,
    };

    return super.$findOne(
      matchQuery,
      projection,
      populate
    );
  }
}

module.exports = HelpRepository;
