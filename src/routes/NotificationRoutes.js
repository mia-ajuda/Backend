const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const isAuthenticated = require('../validation/middlewares/authFirebase');

const notificationController = new NotificationController();
const routes = express.Router();

routes.use(isAuthenticated);
routes.get('/notification/user/:id', async (req, res, next) => {
  notificationController.getUserNotificationsById(req, res, next);
});

module.exports = routes;
