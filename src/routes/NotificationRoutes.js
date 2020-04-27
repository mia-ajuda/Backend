const express = require('express');
const NotificationController = require('../controllers/NotificationController');

const notificationController = new NotificationController();
const routes = express.Router();

routes.get('/notification/user/:id', async (req, res, next) => {
    notificationController.getUserNotificationsById(req, res, next);
});

module.exports = routes;
