const BaseRepository = require('./BaseRepository')
const SessionSchema = require("../models/Session");
const jwt = require('jsonwebtoken');

class SessionRepository extends BaseRepository {

    constructor() {
        super(SessionSchema);
    }

    async create(sessionUser) {
        return await super.$save(sessionUser);
    }

    async getSession(data) {
        const session = await super.findOne({ email: data.email });
    
        if(!session) {
            throw {error: 'User not find'};
        }

        const isMatch = session.comparePassword(data.password);

        if(!isMatch) {
            throw {error: 'Email or password invalid!'};
        }

        const payload = { 
            email: session.email,
            password: session.password
         };
        const options = { expiresIn: '1d' };
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, options);

        return res.json({ token });
    }
}

module.exports = SessionRepository;