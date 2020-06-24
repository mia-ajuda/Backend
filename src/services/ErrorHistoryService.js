const Sentry = require('@sentry/node');

class ErrorHistoryService {
  constructor(err) {
    console.log(err);
    this.err = err;
    this.message = err.message;
    this.saveError();
  }

  saveError() {
    try {
      Sentry.captureException(this.err);
    } catch (err) {
      console.log('Não foi possível salvar o erro!');
      console.log(err);
    }
  }
}

module.exports = ErrorHistoryService;
