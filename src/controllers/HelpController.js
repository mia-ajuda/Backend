const HelpService = require('../services/HelpService');
const mongoose = require('mongoose')

class HelpController {

    constructor() {
        this.HelpService = new HelpService();
    }

    async createHelp(req, res, next) {
        const data = {
            ...req.body
        }
        try {
            const result = await this.HelpService.createHelp(data);
            res.status(201);
            res.json(result);
            next();
        } catch (err) {
            res.status(400);
            res.send(err);
            next();
        }
    }


    async getHelpById(req, res, next) {
        const id = req.params.id
        try {
            const result = await this.HelpService.getHelpByid(id);
            res.status(200);
            res.json(result);
            next();
        } catch (err) {
            res.status(400);
            res.json(err);
            next();
        }
    }

    async getHelpList(req, res, next) {
        const id = req.query.id
        const query = id ? { ownerId: { $ne: id } } : {}
        try {
            const result = await this.HelpService.getHelpList(query)
            res.status(200);
            res.json(result);
            next();
        } catch (err) {
            res.status(400);
            res.json(err);
            next();
        }
    }
}

module.exports = HelpController