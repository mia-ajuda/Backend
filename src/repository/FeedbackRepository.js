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

  async listByReceiver(receiverId) {
    const result = await super.$list({ receiverId }, null, ['sender', 'photo', 'name']);
    return result;
  }
}

module.exports = FeedbackRepository;
