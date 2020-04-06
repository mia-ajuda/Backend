const BaseRepository = require('./BaseRepository');
const HelpSchema = require('../models/Help');

class HelpRepository extends BaseRepository {
    constructor() {
        super(HelpSchema);
    }

    async create(help) {
        const result = await super.$save(help);
        return result;
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

    async update(help) {
        return await super.$update(help);
    }
}

module.exports = HelpRepository;
