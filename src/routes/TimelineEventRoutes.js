const express = require('express');
const TimelineEventController = require('../controllers/TimelineEventController');

const timelineEventController = new TimelineEventController();
const routes = express.Router();

routes.get('/timeline', async (req, res, next) => {
  timelineEventController.getTimelineEvents(req, res, next);
});

module.exports = routes;
