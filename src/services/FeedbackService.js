const FeedbackRepository = require('../repository/FeedbackRepository');

class FeedbackService {
  constructor() {
    this.FeedbackRepository = new FeedbackRepository();
  }

  async create(feedback) {
    const newFeedback = await this.FeedbackRepository.create(feedback);
    return newFeedback;
  }

  async listByReceiver(receiverId) {
    const result = await this.FeedbackRepository.listByReceiver(receiverId);
    return result;
  }
}

module.exports = FeedbackService;
