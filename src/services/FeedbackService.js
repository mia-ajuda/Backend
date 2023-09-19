const FeedbackRepository = require('../repository/FeedbackRepository');

class FeedbackService {
  constructor() {
    this.FeedbackRepository = new FeedbackRepository();
  }

  async create(feedback) {
    const newFeedback = await this.FeedbackRepository.create(feedback);
    return newFeedback;
  }

  async listByReceiver(receiver) {
    const result = await this.FeedbackRepository.listByReceiver(receiver);
    return result;
  }
}

module.exports = FeedbackService;
