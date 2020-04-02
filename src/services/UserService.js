const UserRepository = require('../repository/UserRepository');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }


    async createUser(data) {
        try {

            const createdUser = await this.userRepository.create(data);

            return createdUser;
        } catch(err) {
            throw err;
        }
    }

    async getUser(id) {
        const user = await this.userRepository.getById(id);

        if (!user) {
            throw { error:'Usuário não encontrado' }
        }

        return user
    }

    async updateUserLocationById({id, longitude, latitude}) {
        const user = await this.getUser(id);

        if (longitude || latitude) {
            user.location.longitude = longitude || user.location.longitude
            user.location.latitude = latitude || user.location.latitude
        }

        await this.userRepository.updateUserLocationById(user)
    }

    async deleteUserLogically(id) {
        const user = await this.getUser(id);

        user.active = false;

        await this.userRepository.deleteUserLogically(user);
    }
}

module.exports = UserService