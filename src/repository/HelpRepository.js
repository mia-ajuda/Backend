const BaseRepository = require('./BaseRepository');
const HelpSchema = require("../models/Help");
const helpStatusEnum = require('../utils/enums/helpStatusEnum')

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

    async listToExpire() {
        let date = new Date()
        date.setDate(date.getDate() - 14)
        return await super.$list({ creationDate: { $lt: new Date(date) }, status: { $in: [helpStatusEnum.WAITING, helpStatusEnum.ON_GOING] } })
    }

    async delete(help) {
        help.status = helpStatusEnum.DELETED;
        return await super.$update(help)
    }
    
    async listByStatus(id, status) {
        const result = await super.$list({ ownerId: id, status });
        return result;
    }
}

module.exports = HelpRepository;
