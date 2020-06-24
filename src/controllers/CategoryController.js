const CategoryService = require('../services/CategoryService');
const ErrorHistoryService = require('../services/ErrorHistoryService');

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
      const savedError = new ErrorHistoryService(err);
      res.status(400).json({ error: savedError.message });
      next();
    }
  }

  async getCategoryList(req, res, next) {
    const id = req.query.id || null;

    try {
      const result = await this.CategoryService.getCategoryList(id);
      res.status(200).json(result);
      next();
    } catch (err) {
      const savedError = new ErrorHistoryService(err);
      res.status(400).json({ error: savedError.message });
      next();
    }
  }
}

module.exports = CategoryController;
