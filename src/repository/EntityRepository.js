const BaseRepository = require('./BaseRepository');
const EntitySchema = require('../models/Entity');

class EntityRepository extends BaseRepository {
  constructor() {
    super(EntitySchema);
  }

  async create(entity) {
    const result = await super.$save(entity);
    return result;
  }

  async getById(id) {
    const result = await super.$getById(id);
    return result;
  }

  async getEntityByEmail(email) {
    const result = await super.$list({ email });
    return result[0];
  }

  async update(entity) {
    const result = await super.$update(entity);
    return result;
  }

  async checkEntityExistence(id) {
    const entities = await super.$listAggregate([
      {
        $match: {
          $or: [
            { cnpj: id },
            { email: id },
          ],
        },
      }, {
        $count: 'id',
      },
    ]);

    let result = 0;

    if (entities[0] && entities[0].id > 0) {
      result = entities[0].id;
    }

    return result;
  }

  async removeEntity({ id, email }) {
    const query = {};
    query._id = id;
    query.email = email;

    await super.$destroy(query);
  }

  async findOneEntityWithProjection(query, projection) {
    const entity = await super.$findOne(query, projection);
    return entity;
  }
}

module.exports = EntityRepository;
