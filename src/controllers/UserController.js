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
        }

        try {
            const result = await this.userService.createUser(data);
            res.status(201).json(result);
            next();
        }
        catch (err) {
            res.status(400).json(err);
            next();
        }
    }


    async editUserById(req, res, next) {
        const data = {
            id: req.params.id,
            photo: req.body.photo,
            name: req.body.name,
            phone: req.body.phone
        }
        try {
            const result = await this.userService.editUserById(data);
            res.status(200).json(result);
            return next();
        }catch (err) {
            res.status(400).json(err);
            return next();
        }
    }

    async editUserAddressById(req, res, next) {

        const data = {
            id: req.params.id,
            cep: req.body.cep,
            number: req.body.number,
            city: req.body.city,
            state: req.body.state,
            complement: req.body.complement
        }
        
        try {
            const result = await this.userService.editUserAddressById(data);
            res.status(200).json(result);
            return next();
        }catch (err) {
            res.status(400).json(err);
            return next();
        }
    }


    async deleteUserLogic(req, res, next) {
        const id  = req.params.id;

        try {
            const result = await this.userService.deleteUserLogically(id);
            res.status(200).json(result);
            return next();
        }catch (err) {
            res.status(400).json(err);
            return next();
        }
    }


    async getUserById(req,res,next) {
        const id = req.params.id

        try {
            const result = await this.userService.getUser(id);
            res.status(200).json(result);
            next();
        }
        catch (err) {
            res.status(400).json(err);
            next();
        }
    }

    async updateUserLocationById(req,res,next) {

        const data = {
            id: req.params.id,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        }

        try {
            const result = await this.userService.updateUserLocationById(data);
            res.status(200).json(result);
            next();
        }
        catch (err) {
            res.status(400).json(err);
            next();
        }
    }
}

module.exports = UserController;
