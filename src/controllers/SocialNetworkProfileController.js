const SocialNetworkService = require('../services/SocialNetworkService');
const saveError = require('../utils/ErrorHistory');

class HelpController {
  constructor() {
    this.socialNetworkService = new SocialNetworkService();
  }

  async followUser(req, res, next) {
    const { followerId, followedId } = req.params;
    try {
      await this.socialNetworkService.followUser(followerId, followedId);
      res.status(204).send();
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async unfollowUser(req, res, next) {
    const { followerId, followedId } = req.params;
    try {
      await this.socialNetworkService.unfollowUser(followerId, followedId);
      res.status(204).send();
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

}

module.exports = HelpController;
