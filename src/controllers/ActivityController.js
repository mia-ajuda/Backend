const ActivityService = require('../services/ActivityService');

class ActivityController {
  constructor() {
    this.ActivityService = new ActivityService();
  }

  async fetchActivityList(req, res) {
    const { id } = req.query;
    const { isUserEntity } = global;
    const coords = req.query.coords.split(",").map((coord) => Number(coord));
    const categoryArray = req.query.categoryId?.split(',')
    const activitiesArray = req.query.activityId?.split(",") || ["getAll"];
    const getOtherUsers = req.query.getOtherUsers === "true";

    try {
      const activityList = await this.ActivityService.fetchActivityList(
        coords,
        id,
        isUserEntity,
        categoryArray,
        activitiesArray,
        getOtherUsers,
      );
      return res.json(activityList);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ActivityController;
