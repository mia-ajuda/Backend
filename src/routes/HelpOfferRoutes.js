const express = require('express');
const HelpOfferController = require('../controllers/HelpOfferController');
const isAuthenticated = require('../validation/middlewares/authFirebase');

const helpOfferController = new HelpOfferController();
const routes = express.Router();

routes.post('/helpOffer/create', isAuthenticated, (req, res, next) => {
  helpOfferController.createHelpOffer(req, res, next);
});
routes.get('/helpOffer/list', (req, res, next) => {
  helpOfferController.listOffer(req, res, next);
});

routes.get('/helpOffer/list/:ownerId', isAuthenticated, (req, res, next) => {
  helpOfferController.listOfferByOwnerId(req, res, next);
});

routes.put('/helpOffer/possibleHelpedUsers', isAuthenticated, (req, res, next) => {
  helpOfferController.addPossibleHelpedUsers(req, res, next);
});

module.exports = routes;