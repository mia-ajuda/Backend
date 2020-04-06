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
        const query = id ? { ownerId: { $ne: id } } : {};

        const result = await super.$list(query);
        return result;
    }

    async listByStatus(id, status) {
        const result = await super.$list({ ownerId: id, status });
        return result;
    }
}

module.exports = CategoryRepository;
