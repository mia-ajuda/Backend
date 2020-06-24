const Sentry = require('@sentry/node');

class ErrorHistoryService extends Error {
  constructor(message) {
    super(message);
    console.log(this);
    this.jsonError = this.showError();
    this.saveError();
  }

  showError() {
    const errorMessage = {
      message: this.message,
    };

    return errorMessage;
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
