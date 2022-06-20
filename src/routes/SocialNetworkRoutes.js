const express = require("express");
const SocialNetworkProfileController = require("../controllers/SocialNetworkProfileController");
const isAuthenticated = require("../validation/middlewares/authFirebase");

const routes = express.Router();
const socialNetworkProfileController = new SocialNetworkProfileController();

routes.put("/socialNetworkProfile/followUser/:followerId/:followedId", /*isAuthenticated,*/ async (req, res, next) => {
  socialNetworkProfileController.followUser(req, res, next);
});

routes.put("/socialNetworkProfile/unfollowUser/:followerId/:followedId", /*isAuthenticated,*/ async (req, res, next) => {
  socialNetworkProfileController.unfollowUser(req, res, next);
});

module.exports = routes;
