const CategoryService = require('../services/CategoryService');

class CategoryController {
    constructor() {
        this.CategoryService = new CategoryService();
    }

    async getCategoryById(req, res, next) {
        const { id } = req.params;
        try {
            const result = await this.CategoryService.getCategoryByid(id);
            res.status(200).json(result);
            next();
        } catch (err) {
            res.status(400).json({ error: err });
            next();
        }
    }

    async getCategoryList(req, res, next) {
        const id = req.query.id || null;
        const status = req.query.status || null;
        try {
            let result;
            if (id && status) {
                result = await this.CategoryService.getCategoryListByStatus(id, status);
            } else {
                result = await this.CategoryService.getCategoryList(id);
            }
            res.status(200).json(result);
            next();
        } catch (err) {
            res.status(400).json({ error: err });
            next();
        }
    }
}

module.exports = CategoryController;
