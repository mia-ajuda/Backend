const BaseRepository = require('./BaseRepository');
const TimelineEventSchema = require('../models/TimelineEvent');

class TimelineEventRepository extends BaseRepository {
  constructor() {
    super(TimelineEventSchema);
    this.populateData = ['template'];
  }

  async create(timelineEvent) {
    const result = await super.$save(timelineEvent, {}, this.populateData);
    return result;
  }

  async getUserEvent(userId, templateId) {
    const result = await super.$findOne({ user: userId, template: templateId }, null, this.populateData);
    return result;
  }

  async listByUserId(userId) {
    const result = await super.$list({ user: userId }, null, this.populateData);
    return result;
  }
}

module.exports = TimelineEventRepository;
