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
            throw new Error('Usuário não encontrado')
        }

        return user
    }
}

module.exports = UserService