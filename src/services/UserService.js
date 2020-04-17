const UserRepository = require('../repository/UserRepository');
const firebase = require("../config/authFirebase");


class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }


    async createUser(data) {
        if (data.password.length < 8) {
            throw "Senha inválida"
        }

        if (data.cpf.length >= 11) {
            data.cpf = data.cpf.replace(/[-.]/g, '');
        }

        try {
            const createdUser = await this.userRepository.create(data);
            
            if (!data.hasUser) {
                // Cria o usuário no firebase
                await firebase
                    .auth()
                    .createUser({
                        email: data.email,
                        password: data.password,
                        displayName: data.name,
                    })
                    .catch(async (err) => {
                        await this.removeUser(data.email);
                        throw err;
                    });
            }

            return createdUser;
        } catch (err) {
            throw err;
        }
    }

    async getUser({id = undefined, email = undefined}) {
        if (!id && !email) {
            throw { id: 'Nenhum identificador encontrado' };
        }
        let user;

        if (id) {
            user = await this.userRepository.getById(id);
        } else {
            user = await this.userRepository.getUserByEmail(email);
        }
        if (!user) {
            throw 'Usuário não encontrado';
        }

        return user;
    }

    async editUserById({
        email, photo, name, phone,notificationToken
    }) {
        const user = await this.getUser({email});

        if (!user) {
            throw 'Usuário não encontrado';
        }

        user.photo = photo || user.photo;
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.notificationToken = notificationToken || user.notificationToken

        const result = await this.userRepository.update(user);

        return result;
    }


    async editUserAddressById({
        email, cep, number, city, state, complement,
    }) {
        const user = await this.getUser({email});

        if (!user) {
            throw 'Usuário não encontrado';
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

    async updateUserLocationById({ email, longitude, latitude }) {
        const user = await this.getUser({email});

        if (!user) {
            throw 'Usuário não encontrado';
        }

        if (longitude || latitude) {
            user.location.coordinates[0] = longitude || user.location.coordinates[0];
            user.location.coordinates[1] = latitude || user.location.coordinates[1];
        }

        const result = await this.userRepository.update(user);

        return result;
    }

    async deleteUserLogically(email) {
        const user = await this.getUser({email});

        user.active = false;

        await this.userRepository.update(user);

        return {'message': `User ${id} deleted!`};
    }

    async removeUser(email) {
        try {
            const user = await this.getUser({email});
            await this.userRepository.removeUser({id: user._id, email});
        } catch {
            return
        }
    }
}

module.exports = UserService;
