const SocialNetworkService = require('../services/SocialNetworkService');
const saveError = require('../utils/ErrorHistory');

class HelpController {
  constructor() {
    this.socialNetworkService = new SocialNetworkService();
  }

  async followUser(req, res, next) {
    const { followerId, userId } = req.params;
    try {
      const result  = await this.socialNetworkService.followUser(followerId, userId);
      res.status(200).send(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async unfollowUser(req, res, next) {
    const { followerId, userId } = req.params;
    try {
      const result = await this.socialNetworkService.unfollowUser(followerId, userId);
      res.status(200).send(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }



  async findUsers(req, res, next) {
    const { userId, username } = req.params;
    try {
      const result = await this.socialNetworkService.findUsers(userId, username);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getUserActivities(req, res, next){
    const { userId } = req.params;
    try {
      const result = await this.socialNetworkService.getUserActivities(userId);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

}

module.exports = HelpController;
