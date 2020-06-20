const BaseRepository = require('./BaseRepository');
const ErrorHistory = require('../models/ErrorHistory');

class ErrorHistoryRepository extends BaseRepository {
  constructor() {
    super(ErrorHistory);
  }

  async create(msg, code) {
    const data = {
      code,
      message: msg,
    };
    const result = await super.$save(data);
    if (!result) {
      throw new Error();
    }
  }
}

module.exports = ErrorHistoryRepository;
