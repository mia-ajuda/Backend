const sessionController = require("../controllers/SessionController");
const SessionController = new sessionController();
const express = require("express");
const routes = express.Router();

routes.post("/signup", async (req, res, next) => {
    SessionController.signUp(req, res, next);
});

module.exports = routes
