const TimelineEventRepository = require('../repository/TimelineEventRepository');

class TimelineEventService {
  constructor() {
    this.TimeLineEventRepository = new TimelineEventRepository();
  }

  async create(timelineEvent) {
    const { user, template } = timelineEvent;
    const userEvent = await this.TimeLineEventRepository.getUserEvent(user, template);
    if (userEvent) {
      return userEvent;
    }
    const result = await this.TimeLineEventRepository.create(timelineEvent);
    return result;
  }

  async listByUserId(userId) {
    const result = await this.TimeLineEventRepository.listByUserId(userId);
    return result;
  }
}

module.exports = TimelineEventService;
