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

    async list(id, status, except, helper) {
        const ownerId = except ? { $ne: id } : helper ? null : id;
        const helperId = helper ? id : null;
        const query = {}
        if (status) query.status = status;
        if (helper) query.helperId = helperId;
        else query.ownerId = ownerId
        const result = await super.$list(query);
        return result;
    }

    async countDocuments(id) {
        const query = {};
        query.ownerId = id;
        query.active = true;
        const result = await super.$countDocuments(query);

        return result;
    }
}

module.exports = HelpRepository;
