const express = require('express');
const EntityController = require('../controllers/EntityController');
const isAuthenticated = require('../validation/middlewares/authFirebase');

const routes = express.Router();
const entityController = new EntityController();

routes.post('/entity', async (req, res, next) => {
  entityController.createEntity(req, res, next);
});

routes.get('/entity/getEntity/:id*?/', isAuthenticated, async (req, res, next) => {
  entityController.getEntityById(req, res, next);
});

routes.put('/entity', isAuthenticated, async (req, res, next) => {
  entityController.editEntityById(req, res, next);
});

routes.put('/entity/address', isAuthenticated, async (req, res, next) => {
  entityController.editEntityAddressById(req, res, next);
});

routes.put('/entity/location', isAuthenticated, async (req, res, next) => {
  entityController.updateEntityLocationById(req, res, next);
});

routes.delete('/entity', isAuthenticated, async (req, res, next) => {
  entityController.deleteEntityLogic(req, res, next);
});

// Verifica a existência de uma entidade/ONG baseado no email ou CNPJ
routes.get('/checkEntityExistence/:entityIdentifier', async (req, res, next) => {
  entityController.checkEntityExistence(req, res, next);
});

module.exports = routes;
