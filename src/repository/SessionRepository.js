const BaseRepository = require('./BaseRepository')
const SessionSchema = require("../models/Session");
const firebase = require('../config/authFirebase');

class SessionRepository extends BaseRepository {
    constructor() {
        super(SessionSchema);
    }

    async create(sessionUser) {        
        try {
            await firebase.auth().createUser(sessionUser);
        } catch (err) {
            throw err;
        }   
        
        return await super.$save(sessionUser);
    }  
}

module.exports = SessionRepository;