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

        return user;
    }

    async editUserById({id, photo = undefined, name = undefined, phone = undefined}) {
        const user = await this.getUser(id);

        if (!user) {
            throw { error:'Usuário não encontrado' }
        }

        user.photo = photo || user.photo;
        user.name = name || user.name;
        user.phone = phone || user.phone;

        const result = await this.userRepository.update(user);

        return result;
    }

    async updateUserLocationById({id, longitude, latitude}) {
        const user = await this.getUser(id);

        if (!user) {
            throw { error:'Usuário não encontrado' }
        }

        if (longitude || latitude) {
            user.location.longitude = longitude || user.location.longitude;
            user.location.latitude = latitude || user.location.latitude;
        }

        const result = await this.userRepository.update(user);

        return result;
    }

    async deleteUserLogically(id) {
        const user = await this.getUser(id);

        user.active = false;

        await this.userRepository.update(user);
    }
}

module.exports = UserService