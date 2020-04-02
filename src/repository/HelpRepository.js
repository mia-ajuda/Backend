const BaseRepository = require('./BaseRepository');
const HelpSchema = require("../models/Help");
const helpStatusEnum = require('../utils/enums/helpStatusEnum')

class HelpRepository extends BaseRepository {

    constructor() {
        super(HelpSchema);
    }

    async create(help) {
        return await super.$save(help);
    }

    async getById(id) {
        return await super.$getById(id);
    }

    async list(id) {
        const query = id ? { ownerId: { $ne: id } } : {}
        return await super.$list(query);
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
}

module.exports = HelpRepository