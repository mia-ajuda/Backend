const express = require('express');
const ActivityController = require('../controllers/ActivityController');
const isAuthenticated = require('../validation/middlewares/authFirebase');

const activityController = new ActivityController();
const routes = express.Router();

routes.get('/activity/list', isAuthenticated, (req, res) => {
  activityController.fetchActivityList(req, res);
});

module.exports = routes;
