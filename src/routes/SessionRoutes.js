const sessionController = require("../controllers/SessionController");
const SessionController = new sessionController();
const express = require("express");
const routes = express.Router();
const isAuthenticated = require('../validation/middlewares/authFirebase');

routes.post("/signup", async (req, res, next) => {
    SessionController.signUp(req, res, next);
});

routes.get("/teste", isAuthenticated, async (req, res, next) => {
    SessionController.teste(req, res, next);
});

module.exports = routes
