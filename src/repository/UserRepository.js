const BaseRepository = require('./BaseRepository')
const UserSchema = require("../models/User");



class UserRepository extends BaseRepository {

    constructor() {
        super(UserSchema);
    }

    async create(user) {
        return await super.$save(user);
    }

    async getById(id) {
        return await super.$getById(id);
    }

    async updateUserLocationById(user) {
        return await super.$update(user);
    }

    async deleteUserLogically(user) {
        return await super.$update(user);
    }
}

module.exports = UserRepository