const UserService = require('../services/UserService');

class UserController {

    constructor() {
        this.userService = new UserService();
    }

    async createUser(req,res,next) {
        const data = {
            ...req.body
        }

        const result = await this.userService.createUser(data);

        res.status(201);
        res.json(result);
        next();
    }
    
    
    async getUserById(req,res,next) {
        const id = req.params.id

        const result = await this.userService.getUser(id);

        res.status(200);
        res.json(result);
        next();
    }
}

module.exports = UserController