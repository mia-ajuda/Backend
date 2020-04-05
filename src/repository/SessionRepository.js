const BaseRepository = require('./BaseRepository')
const SessionSchema = require("../models/Session");



class SessionRepository extends BaseRepository {

    constructor() {
        super(SessionSchema);
    }

    async create(sessionUser) {
        return await super.$save(sessionUser);
    }
}

module.exports = SessionRepository;