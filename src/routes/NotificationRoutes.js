const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const isAuthenticated = require('../validation/middlewares/authFirebase');

const notificationController = new NotificationController();
const routes = express.Router();

routes.get('/notification/user/:id', isAuthenticated, async (req, res, next) => {
  notificationController.getUserNotificationsById(req, res, next);
});

routes.post('/notifications/send', isAuthenticated, async (req, res, next) => {
  notificationController.sendNotifications(req, res, next);
});

module.exports = routes;
