const SessionRepository = require('../repository/SessionRepository');

class SessionService {
    constructor() {
        this.SessionRepository = new SessionRepository();
    }

    async SignUpUser(data) {
        try {
            const createdSession = await this.SessionRepository.create(data);

            return createdSession;
        } catch(err) {
            throw err;
        }
    }

    async SignInUser(data) {
        try {
            const session = await this.SessionRepository.getSession(data);

            return createdUser;
        } catch(err) {
            throw err;
        }
    }
}

module.exports = SessionService;