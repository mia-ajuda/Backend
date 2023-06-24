
const saveError = require('../utils/ErrorHistory');
const TimelineEventService = require('../services/TimelineEventService');

class TimelineEventController {
    constructor() {
        this.TimelineEventService = new TimelineEventService();
    }

    async getTimelineEvents(req, res, next) {
        const userId = req.query.userId || null;
        try {
            const result = await this.TimelineEventService.listByUserId(userId);
            res.status(200).json(result);
            next();
        } catch (err) {
            await saveError(err);
            res.status(400).json({ error: err.message });
            next();
        }
    }
}

module.exports = TimelineEventController;
