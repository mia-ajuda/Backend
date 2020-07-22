const BaseRepository = require('./BaseRepository');
const { Notification: NotificationSchema } = require('../models/Notification');

class NotificationRepository extends BaseRepository {
  constructor() {
    super(NotificationSchema);
  }

  async create(notification) {
    const result = await super.$save(notification);

    return result;
  }

  async getUserNotificationsById(id) {
    const result = await NotificationSchema.find({ userId: id })
      .sort({ registerDate: -1 })
      .limit(30);

    return result;
  }
}

module.exports = NotificationRepository;
