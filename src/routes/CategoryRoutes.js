const express = require('express');
const CategoryController = require('../controllers/CategoryController');

const categoryController = new CategoryController();
const routes = express.Router();

routes.get('/category/:id', async (req, res, next) => {
  categoryController.getCategoryById(req, res, next);
});

routes.get('/category', async (req, res, next) => {
  categoryController.getCategoryList(req, res, next);
});

module.exports = routes;
