const express = require('express');
const CampaignController = require('../controllers/CampaignController');
const isAuthenticated = require('../validation/middlewares/authFirebase');

const campaignController = new CampaignController();
const routes = express.Router();

routes.post('/campaign', isAuthenticated, (req, res, next) => {
  campaignController.createCampaign(req, res, next);
});
routes.get('/campaign', isAuthenticated, (req, res, next) => {
  campaignController.listCampaignNear(req, res, next);
});
routes.get('/campaign', isAuthenticated, (req, res, next) => {
  campaignController.listCampaignByOwnerId(req, res, next);
})
routes.delete('/campaign', isAuthenticated, async (req, res, next) => {
    campaignController.deleteCampaign(req, res, next);
});
  
module.exports = routes;
