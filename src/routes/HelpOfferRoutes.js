const express = require("express");
const HelpOfferController = require("../controllers/HelpOfferController");
const isAuthenticated = require("../validation/middlewares/authFirebase");

const helpOfferController = new HelpOfferController();
const routes = express.Router();

routes.post("/helpOffer", isAuthenticated, (req, res, next) => {
  helpOfferController.createHelpOffer(req, res, next);
});

routes.get("/helpOffer/list", isAuthenticated, (req, res, next) => {
  // ListHelpOffersByCategory
  helpOfferController.listHelpsOffers(req, res, next);
});

routes.get(
  "/helpOffer/listByOwner/:ownerId",
  (req, res, next) => {
    console.log("Test");
    helpOfferController.listHelpOffersByOwnerId(req, res, next);
  }
);

routes.get(
  "/helpOffer/list/:helpedUserId",
  isAuthenticated,
  (req, res, next) => {
    helpOfferController.listHelpOffersByHelpedUserId(req, res, next);
  }
);

routes.put(
  "/helpOffer/possibleHelpedUsers/:helpedId/:helpOfferId",
  isAuthenticated,
  (req, res, next) => {
    helpOfferController.addPossibleHelpedUsers(req, res, next);
  }
);

routes.delete(
  "/helpOffer/:helpOfferId",
  isAuthenticated,
  async (req, res, next) => {
    helpOfferController.finishHelpOfferByOwner(req, res, next);
  }
);

module.exports = routes;
