const express = require("express");
const SocialNetworkProfileController = require("../controllers/SocialNetworkProfileController");
const isAuthenticated = require("../validation/middlewares/authFirebase");

const routes = express.Router();
const socialNetworkProfileController = new SocialNetworkProfileController();

routes.put("/socialNetworkProfile/followUser/:followerId/:userId", isAuthenticated, async (req, res, next) => {
  socialNetworkProfileController.followUser(req, res, next);
});

routes.put("/socialNetworkProfile/unfollowUser/:followerId/:userId",isAuthenticated, async (req, res, next) => {
  socialNetworkProfileController.unfollowUser(req, res, next);
});


routes.get("/socialNetworkProfile/findUsers/:userId/:username",isAuthenticated, async (req, res, next) => {
  socialNetworkProfileController.findUsers(req, res, next);
});

routes.get("/socialNetworkProfile/getUserActivities/:userId",isAuthenticated, async (req, res, next) => {
  socialNetworkProfileController.getUserActivities(req, res, next);
});





module.exports = routes;
