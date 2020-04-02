const express = require('express');
const HelpController = require("../controllers/HelpController");


const helpController = new HelpController();
const routes = express.Router();


routes.post('/Help', async (req, res, next) => {
    helpController.createHelp(req, res, next)
});
routes.get('/Help/getOne/:id', async (req, res, next) => {
    helpController.getHelpById(req, res, next)
})
routes.get('/Help', async (req, res, next) => {
    helpController.getHelpList(req, res, next)
})

module.exports = routes