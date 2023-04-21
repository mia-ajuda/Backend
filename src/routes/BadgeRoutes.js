const express = require('express');
const BadgeController = require('../controllers/BadgeController');

const badgeController = new BadgeController();
const routes = express.Router();

routes.get('/badges', async (req, res, next) => {
  badgeController.getBadgeList(req, res, next);
});

module.exports = routes;
