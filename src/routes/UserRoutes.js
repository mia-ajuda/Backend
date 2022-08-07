const express = require('express');
const UserController = require('../controllers/UserController');
const isAuthenticated = require('../validation/middlewares/authFirebase');

const routes = express.Router();
const userController = new UserController();

routes.post('/user', async (req, res, next) => {
  userController.createUser(req, res, next);
});

routes.get('/user/getUser/:id*?/', isAuthenticated, async (req, res, next) => {
  userController.getUserById(req, res, next);
});

routes.get(
  '/user/getAnyUser/:id*?/',
  isAuthenticated,
  async (req, res, next) => {
    userController.getAnyUserById(req, res, next);
  },
);

routes.put('/user', isAuthenticated, async (req, res, next) => {
  userController.editUserById(req, res, next);
});

routes.put('/user/address', isAuthenticated, async (req, res, next) => {
  userController.editUserAddressById(req, res, next);
});
routes.put('/user/location', isAuthenticated, async (req, res, next) => {
  userController.updateUserLocationById(req, res, next);
});

routes.delete('/user', isAuthenticated, async (req, res, next) => {
  userController.deleteUserLogic(req, res, next);
});

routes.get('/groupRisk', async (req, res, next) => {
  userController.getUserGroupRiskList(req, res, next);
});

// Verifica a existência de um usuário baseado no email ou CPF
routes.get('/checkUserExistence/:userIdentifier', async (req, res, next) => {
  userController.checkUserExistence(req, res, next);
});

module.exports = routes;
