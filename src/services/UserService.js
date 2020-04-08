const UserRepository = require('../repository/UserRepository');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }


    async createUser(data) {
        if (data.cpf.length >= 11) {
            data.cpf = data.cpf.replace(/[-.]/g, '');
        }

        try {
            const createdUser = await this.userRepository.create(data);

            return createdUser;
        } catch (err) {
            throw err;
        }
    }

    async getUser(id) {
        const user = await this.userRepository.getById(id);

        if (!user) {
            throw { user: 'Usuário não encontrado' };
        }

        return user;
    }

    async editUserById({
        id, photo, name, phone,
    }) {
        const user = await this.getUser(id);

        if (!user) {
            throw { user: 'Usuário não encontrado' };
        }

        user.photo = photo || user.photo;
        user.name = name || user.name;
        user.phone = phone || user.phone;

        const result = await this.userRepository.update(user);

        return result;
    }


    async editUserAddressById({
        id, cep, number, city, state, complement,
    }) {
        const user = await this.getUser(id);

        if (!user) {
            throw ({ user: 'Usuário não encontrado' });
        }

        const address = {
            cep: cep || user.address.cep,
            number: number || user.address.number,
            city: city || user.address.city,
            state: state || user.address.state,
            complement: complement || user.address.complement,
        };

        user.address = address;

        const result = await this.userRepository.update(user);

        return result;
    }

    async updateUserLocationById({ id, longitude, latitude }) {
        const user = await this.getUser(id);

        if (!user) {
            throw { user: 'Usuário não encontrado' };
        }

        console.log(latitude, longitude);

        if (longitude || latitude) {
            user.location.coordinates[0] = longitude || user.location.coordinates[0];
            user.location.coordinates[1] = latitude || user.location.coordinates[1];
        }

        const result = await this.userRepository.update(user);

        return result;
    }

    async deleteUserLogically(id) {
        const user = await this.getUser(id);

        user.active = false;

        await this.userRepository.update(user);

        return {'message': `User ${id} deleted!`};
    }
}

module.exports = UserService;
