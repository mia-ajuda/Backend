const BaseRepository = require('./BaseRepository');
const { Notification: NotificationSchema } = require('../models/Notification');

class NotificationRepository extends BaseRepository {
    constructor() {
        super(NotificationSchema);
    }

    async getUserNotificationsById(id) {
        const result = await NotificationSchema.find({"userId": id})
            .sort({"registerDate": -1})
            .limit(30);
        
        return result;
    }
}

module.exports = NotificationRepository;
