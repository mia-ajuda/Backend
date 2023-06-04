const BaseRepository = require('./BaseRepository');
const feedbackSchema = require('../models/Feedback');

class FeedbackRepository extends BaseRepository {
  constructor() {
    super(feedbackSchema);
  }

  async create(feedback) {
    const newFeedback = await super.$save(feedback);
    return newFeedback;
  }

  async listByReceiver(receiver) {
    const result = await super.$list({ receiver }, null, ['sender']);
    return result;
  }
}

module.exports = FeedbackRepository;
