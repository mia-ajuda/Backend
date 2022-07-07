const express = require('express');
const HelpController = require('../controllers/HelpController');
const isAuthenticated = require('../validation/middlewares/authFirebase');

const helpController = new HelpController();
const routes = express.Router();

routes.post('/help', isAuthenticated, async (req, res, next) => {
  helpController.createHelp(req, res, next);
});

routes.get('/help/aggregation/:id', isAuthenticated, async (req, res, next) => {
  helpController.getHelpWithAggregationById(req, res, next);
});

routes.get('/help/helpInfo/:helpId', isAuthenticated, async (req, res, next) => {
  helpController.getHelpInfoById(req, res, next);
});

routes.get('/help', isAuthenticated, async (req, res, next) => {
  helpController.getHelpList(req, res, next);
});

routes.get('/help/listbyStatus/:userId', isAuthenticated, async (req, res, next) => {
  helpController.getHelpListByStatus(req, res, next);
});

routes.delete('/help/:id', isAuthenticated, async (req, res, next) => {
  helpController.deleteHelpLogic(req, res, next);
});

routes.put('/help/helperConfirmation/:helpId/:helperId', isAuthenticated, async (req, res, next) => {
  helpController.helperConfirmation(req, res, next);
});

routes.put('/help/ownerConfirmation/:helpId/:ownerId', isAuthenticated, async (req, res, next) => {
  helpController.ownerConfirmation(req, res, next);
});

routes.put('/help/chooseHelper/:idHelp/:idHelper', isAuthenticated, async (req, res, next) => {
  helpController.chooseHelper(req, res, next);
});

routes.put('/help/possibleHelpers/:idHelp/:idHelper', isAuthenticated, async (req, res, next) => {
  helpController.addPossibleHelpers(req, res, next);
});

module.exports = routes;
