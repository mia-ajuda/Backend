const HelpService = require('../services/HelpService');

class HelpController {
    constructor() {
        this.HelpService = new HelpService();
    }

    async createHelp(req, res, next) {
        const data = {
            ...req.body,
        };

        try {
            const count = await this.HelpService.getCountHelp(data.ownerId);
            const result = await this.HelpService.createHelp(data);
            res.status(201).json(result);
            next();
        } catch (err) {
            res.status(400).send({ error: err });
            next();
        }
    }


    async getHelpById(req, res, next) {
        const { id } = req.params;
        try {
            const result = await this.HelpService.getHelpByid(id);
            res.status(200).json(result);
            next();
        } catch (err) {
            res.status(400).json({ error: err });
            next();
        }
    }

    async getHelpList(req, res, next) {
        const except = req.query["id.except"] ? true : false;
        const helper = req.query["id.helper"] ? true : false;
        const temp = except ? 'except' : helper ? 'helper' : null;
        const id = temp ? req.query[`id.${temp}`] : req.query.id;
        const status = req.query.status || null;
        try {
            let result;
            result = await this.HelpService.getHelpList(id, status, except, helper);
            res.status(200).json(result);
            next();
        } catch (err) {
            res.status(400).json({ error: err });
            next();
        }
    }
}

module.exports = HelpController;
