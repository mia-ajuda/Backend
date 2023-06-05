const FeedbackService = require('../services/FeedbackService');
const saveError = require('../utils/ErrorHistory');

class FeedbackController {
  constructor() {
    this.FeedbackService = new FeedbackService();
  }

  async create(req, res) {
    try {
      const { message, sender, receiver } = req.body;
      const feedback = {
        sender,
        receiver,
        message,
      };
      const newFeedback = await this.FeedbackService.create(feedback);
      res.status(200).json(newFeedback);
    } catch (error) {
      saveError(error);
      res.status(500).json({ error: 'Erro ao criar feedback' });
    }
  }

  async listByReceiver(req, res) {
    try {
      const { receiver } = req.params;
      const feedbacks = await this.FeedbackService.listByReceiver(
        receiver,
      );
      res.status(200).json(feedbacks);
    } catch (error) {
      saveError(error);
      res.status(500).json({ error: 'Erro ao listar feedbacks' });
    }
  }
}

module.exports = FeedbackController;
