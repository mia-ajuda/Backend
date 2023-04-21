const SocialNetworkService = require('../services/SocialNetworkService');
const saveError = require('../utils/ErrorHistory');

class HelpController {
  constructor() {
    this.socialNetworkService = new SocialNetworkService();
  }

  async followUser(req, res, next) {
    const { selectedProfileId, userId } = req.params;
    try {
      const result = await this.socialNetworkService.followUser(
        selectedProfileId,
        userId,
      );
      res.status(200).send(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async unfollowUser(req, res, next) {
    const { selectedProfileId, userId } = req.params;
    try {
      const result = await this.socialNetworkService.unfollowUser(
        selectedProfileId,
        userId,
      );
      res.status(200).send(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async findUsers(req, res, next) {
    const { userId } = req.params;
    const { name } = req.query;
    try {
      const result = await this.socialNetworkService.findUsers(userId, name);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getUserActivities(req, res, next) {
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

  async getFollowers(req, res, next) {
    const { userId, selectedProfileId } = req.params;
    try {
      const result = await this.socialNetworkService.getFollowers(
        userId,
        selectedProfileId,
      );
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getFollowing(req, res, next) {
    const { userId, selectedProfileId } = req.params;
    try {
      const result = await this.socialNetworkService.getFollowing(
        userId,
        selectedProfileId,
      );
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getUserProfile(req, res, next) {
    const { userId } = req.params;
    const senderEmail = req.decodedToken.email;
    try {
      const result = await this.socialNetworkService.getUserProfile(
        userId,
        senderEmail,
      );
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
