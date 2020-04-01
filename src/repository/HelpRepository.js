const BaseRepository = require('./BaseRepository');
const HelpSchema = require("../models/Help");

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

    async list(query) {
        return await super.$list(query);
    }
}

module.exports = HelpRepository