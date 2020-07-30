const BaseRepository = require('./BaseRepository');
const OfferedHelp = require('../models/HelpOffer');

class OfferdHelpRepository extends BaseRepository {
  constructor() {
    super(OfferedHelp);
  }

  async create(offeredHelp) {
    const newOfferdHelp = await super.$save(offeredHelp);
    return newOfferdHelp;
  }

  async list() {
    const query = null;
    const populate = 'user';
    const helps = await super.$list(query, populate);
    return helps;
  }

  async listByOwnerId(ownerId) {
    const query = { ownerId };
    const helps = await super.$list(query);
    return helps;
  }

  async listByHelpedUserId(helpedUserId) {
    const query = { helpedUserId };
    const helps = await super.$list(query);
    return helps;
  }
}

module.exports = OfferdHelpRepository;
