const ErrorHistoryRepository = require('../repository/ErrorHistoryRepository');

const ErrorHistoryRepository2 = new ErrorHistoryRepository();
class ErrorHistoryService extends Error {
  constructor(message, code) {
    super(message);
    this.msg = message;
    this.code = code;
    this.saveError();
  }

  saveError() {
    try {
      ErrorHistoryRepository2.create(this.msg, this.code);
    } catch (err) {
      console.log('Não foi possível salvar o erro');
      console.log(err);
    }
  }
}

module.exports = ErrorHistoryService;
