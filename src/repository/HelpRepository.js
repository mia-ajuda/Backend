const BaseRepository = require("./BaseRepository");
const HelpSchema = require("../models/Help");
const helpStatusEnum = require('../utils/enums/helpStatusEnum')

class HelpRepository extends BaseRepository {
  constructor() {
    super(HelpSchema);
  }

  async create(help) {
    const result = await super.$save(help);
    return result;
  }

  async getById(id) {
    const result = await super.$getById(id);
    return result;
  }

  async update(help) {
    return await super.$update(help);
  }

  async list(id, status, category, except, helper) {
    const ownerId = except ? { $ne: id } : helper ? null : id;
    const helperId = helper ? id : null;
    const query = {};
    if (status) query.status = status;
    if (category) query.categoryId = { $in: category };
    if (helper) query.helperId = helperId;
    else query.ownerId = ownerId;
    const result = await super.$list(query);
    return result;
  }
  async countDocuments(id) {
    const query = {};
    query.ownerId = id;
    query.active = true;
    const result = await super.$countDocuments(query);

    return result;
  }

  async listToExpire() {
    let date = new Date()
    date.setDate(date.getDate() - 14)
    return await super.$list({ creationDate: { $lt: new Date(date) }, status: { $in: [helpStatusEnum.WAITING, helpStatusEnum.ON_GOING] } })
  }

  async delete(help) {
    help.status = helpStatusEnum.DELETED;
    return await super.$update(help)
  }
}

module.exports = HelpRepository;
