const express = require('express');
const SocialNetworkProfileController = require('../controllers/SocialNetworkProfileController');
const isAuthenticated = require('../validation/middlewares/authFirebase');

const routes = express.Router();
const socialNetworkProfileController = new SocialNetworkProfileController();

routes.put(
  '/socialNetworkProfile/followUser/:selectedProfileId/:userId',
  isAuthenticated,
  async (req, res, next) => {
    socialNetworkProfileController.followUser(req, res, next);
  },
);

routes.put(
  '/socialNetworkProfile/unfollowUser/:selectedProfileId/:userId',
  isAuthenticated,
  async (req, res, next) => {
    socialNetworkProfileController.unfollowUser(req, res, next);
  },
);

routes.get(
  '/socialNetworkProfile/findUsers/:userId',
  isAuthenticated,
  async (req, res, next) => {
    socialNetworkProfileController.findUsers(req, res, next);
  },
);

routes.get(
  '/socialNetworkProfile/getUserActivities/:userId',
  isAuthenticated,
  async (req, res, next) => {
    socialNetworkProfileController.getUserActivities(req, res, next);
  },
);

routes.get(
  '/socialNetworkProfile/getFollowers/:userId/:selectedProfileId',
  isAuthenticated,
  async (req, res, next) => {
    socialNetworkProfileController.getFollowers(req, res, next);
  },
);

routes.get(
  '/socialNetworkProfile/getFollowing/:userId/:selectedProfileId',
  isAuthenticated,
  async (req, res, next) => {
    socialNetworkProfileController.getFollowing(req, res, next);
  },
);

routes.get(
  '/socialNetworkProfile/getUserProfile/:userId',
  isAuthenticated,
  async (req, res, next) => {
    socialNetworkProfileController.getUserProfile(req, res, next);
  },
);

module.exports = routes;
