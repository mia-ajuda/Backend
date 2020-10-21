const express = require('express');
const HelpOfferController = require('../controllers/HelpOfferController');
const isAuthenticated = require('../validation/middlewares/authFirebase');

const helpOfferController = new HelpOfferController();
const routes = express.Router();

routes.post('/helpOffer', isAuthenticated, (req, res, next) => {
  helpOfferController.createHelpOffer(req, res, next);
});
routes.get('/helpOffer/list', isAuthenticated, (req, res, next) => {
  helpOfferController.listHelpsOffers(req, res, next);
});

routes.get('/helpOffer/list/:ownerId', isAuthenticated, (req, res, next) => {
  helpOfferController.listHelpsOffersByOwnerId(req, res, next);
});

routes.get(
  '/helpOffer/list/:helpedUserId',
  isAuthenticated,
  (req, res, next) => {
    helpOfferController.listHelpOffersByHelpedUserId(req, res, next);
  },
);

routes.put(
  '/helpOffer/possibleHelpedUsers/:helpedId/:helpOfferId',
  isAuthenticated,
  (req, res, next) => {
    helpOfferController.addPossibleHelpedUsers(req, res, next);
  },
);

routes.put(
  '/helpOffer/chooseHelpers/:helpOfferId',
  (req, res, next) => {
    helpOfferController.chooseHelpedUser(req, res, next);
  },
);

module.exports = routes;
