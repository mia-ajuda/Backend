const BaseRepository = require('./BaseRepository')
const firebase = require('../config/authFirebase');

class SessionRepository extends BaseRepository {
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