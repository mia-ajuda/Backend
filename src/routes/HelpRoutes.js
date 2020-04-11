const express = require('express');
const HelpController = require('../controllers/HelpController');


const helpController = new HelpController();
const routes = express.Router();


routes.post('/help', async (req, res, next) => {
    helpController.createHelp(req, res, next);
});
routes.get('/help/:id', async (req, res, next) => {
    helpController.getHelpById(req, res, next);
});
routes.get('/help', async (req, res, next) => {
    helpController.getHelpList(req, res, next);
});
routes.delete('/help/:id', async (req, res, next) => {
    helpController.deleteHelpLogic(req, res, next);
});

routes.put('/help/possibleHelpers/:id&:idHelper',async(req,res,next)=>{
    helpController.updatePossibleHelpers(req,res,next);
});

module.exports = routes;
