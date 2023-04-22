const express = require('express');
const BadgeController = require('../controllers/BadgeController');

const badgeController = new BadgeController();
const routes = express.Router();

routes.post('/badges', async (req, res, next) => {
  badgeController.updateOrCreateBadge(req, res, next);
});

routes.get('/badges', async (req, res, next) => {
  badgeController.getBadgeList(req, res, next);
});

routes.get('/badges/history', async (req, res, next) => {
  badgeController.getBadgeHistory(req, res, next);
});

module.exports = routes;
