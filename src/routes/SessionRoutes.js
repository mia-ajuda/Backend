const sessionController = require("../controllers/SessionController");
const SessionController = new sessionController();
const express = require("express");
const routes = express.Router();

routes.post("/signup", async (req, res, next) => {
    SessionController.signUp(req, res, next);
});
routes.get("/signin", async (req, res, next) => {
    SessionController.signIn(req, res, next);
})

module.exports = routes
