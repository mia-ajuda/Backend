const SessionRepository = require('../repository/SessionRepository');

class SessionService {
    constructor() {
        this.SessionRepository = new SessionRepository();
    }

    async SignUpUser(data) {
        try {
            const createdUser = await this.SessionRepository.create(data);

            return createdUser;
        } catch(err) {
            throw err;
        }
    }


}

module.exports = SessionService;