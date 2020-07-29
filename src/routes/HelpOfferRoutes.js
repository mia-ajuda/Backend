const express = require('express');
const HelpOfferController = require('../controllers/HelpOfferController');
const isAuthenticated = require('../validation/middlewares/authFirebase');

const helpOfferController = new HelpOfferController();
const routes = express.Router();

routes.post('/helpOffer/create', isAuthenticated, (req, res, next) => {
  helpOfferController.createHelpOffer(req, res, next);
});

module.exports = routes;
