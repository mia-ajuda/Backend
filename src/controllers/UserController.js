const UserService = require("../services/UserService");

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async createUser(req, res, next) {
        const { latitude, longitude } = req.body;
        const location = {
            type: "Point",
            coordinates: [longitude, latitude]
        };

        const data = {
            ...req.body,
            location
        };

        const result = await this.userService.createUser(data);

        res.status(201);
        res.json(result);
        next();
    }

    async getUserById(req, res, next) {
        const id = req.params.id;

        const result = await this.userService.getUser(id);

        res.status(200);
        res.json(result);
        next();
    }


    async updateUserLocationById(req, res, next) {

        const data = {
            id: req.params.id,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        }

        try {
            const result = await this.userService.updateUserLocationById(data);
            res.status(200);
            res.json(result);
            next();
        }
        catch (err) {
            res.status(400);
            res.json(err);
            next();
        }
    }
}

module.exports = UserController;
