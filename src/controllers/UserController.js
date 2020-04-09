const UserService = require('../services/UserService');
const { riskGroups } = require('../models/RiskGroup');
const firebase = require('../config/authFirebase');


class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async createUser(req, res, next) {
        const { latitude, longitude } = req.body;

        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        };

        const data = {
            location,
            ...req.body,
        }

        if(req.body.password.length < 8) {
            res.status(400).json({ error: 'Senha inválida' });
            next();
        }

        try {
            // Cria o usuário no miaAjuda
            const result = await this.userService.createUser(data);

            // Cria o usuário no firebase
            await firebase.auth().createUser({
                email: req.body.email,
                password: req.body.password,
                displayName: req.body.name,
                phoneNumber: req.body.phone
            });

            res.status(201).json(result);
            next();
        } catch (err) {
            await this.userService.removeUser(req.body.email);
            res.status(400).json({ error: err });
            next();
        }
    }


    async editUserById(req, res, next) {
        const data = {
            id: req.params.id,
            photo: req.body.photo,
            name: req.body.name,
            phone: req.body.phone,
            notificationToken: req.body.notificationToken
        };
        try {
            const result = await this.userService.editUserById(data);
            res.status(200).json(result);
            return next();
        } catch (err) {
            res.status(400).json({ error: err });
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
            complement: req.body.complement,
        };

        try {
            const result = await this.userService.editUserAddressById(data);
            res.status(200).json(result);
            return next();
        } catch (err) {
            res.status(400).json({ error: err });
            return next();
        }
    }


    async deleteUserLogic(req, res, next) {
        const { id } = req.params;

        try {
            const result = await this.userService.deleteUserLogically(id);
            res.status(200).json(result);
            return next();
        } catch (err) {
            res.status(400).json({ error: err });
            return next();
        }
    }


    async getUserById(req, res, next) {
        const data = {
            id: req.params.id,
            email: req.decodedToken.email
        }

        try {
            const result = await this.userService.getUser(data);
            res.status(200).json(result);
            next();
        } catch (err) {
            res.status(400).json({ error: err });
            next();
        }
    }

    async updateUserLocationById(req, res, next) {
        const data = {
            id: req.params.id,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        };

        try {
            const result = await this.userService.updateUserLocationById(data);
            res.status(200).json(result);
            next();
        } catch (err) {
            res.status(400).json({ error: err });
            next();
        }
    }

    async getUserGroupRiskList(req, res, next) {
        res.status(200).json(riskGroups);
        next();
    }
}

module.exports = UserController;
