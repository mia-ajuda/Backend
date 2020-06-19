const BaseRepository = require('./BaseRepository');
const CategorySchema = require('../models/Category');

class CategoryRepository extends BaseRepository {
  constructor() {
    super(CategorySchema);
  }

  async getById(id) {
    const result = await super.$getById(id);
    return result;
  }

  async list(id) {
    const query = id ? { id } : {};
    const result = await super.$list(query);
    return result;
  }
}

module.exports = CategoryRepository;
