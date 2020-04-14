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

routes.put('/help/helperConfirmation/:helpId/:helperId', async (req, res, next) => {
    helpController.helperConfirmation(req, res, next);
});

routes.put('/help/ownerConfirmation/:helpId/:ownerId', async (req, res, next) => {
    helpController.ownerConfirmation(req, res, next);
});

routes.put('/help/chooseHelper/:idHelp/:idHelper', async (req, res, next) =>{
    helpController.chooseHelper(req,res,next);
});

routes.put('/help/possibleHelpers/:idHelp/:idHelper',async(req,res,next)=>{
    helpController.addPossibleHelpers(req,res,next);
});

module.exports = routes;
