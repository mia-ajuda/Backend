const Sentry = require('@sentry/node');

class ErrorHistoryService extends Error {
  constructor(message) {
    super(message);
    console.log(this);
    this.saveError();
  }

  saveError() {
    try {
      Sentry.captureException(this);
    } catch (err) {
      console.log('Não foi possível salvar o erro!');
      console.log(err);
    }
  }
}

module.exports = ErrorHistoryService;
