const express = require('express');
const FeedbackController = require('../controllers/FeedbackController');

const badgeController = new FeedbackController();
const routes = express.Router();

routes.post('/feedback', (req, res) => {
  badgeController.create(req, res);
});

routes.get('/feedback/:receiverId', (req, res) => {
  badgeController.listByReceiver(req, res);
});

module.exports = routes;
