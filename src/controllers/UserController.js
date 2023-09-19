const UserService = require('../services/UserService');
const { riskGroups } = require('../models/RiskGroup');
const saveError = require('../utils/ErrorHistory');
const TimelineEventService = require('../services/TimelineEventService');
const timelineEnum = require('../utils/enums/timelineEnum');

class UserController {
  constructor() {
    this.userService = new UserService();
    this.TimelineEventService = new TimelineEventService();
  }

  async createUser(req, res, next) {
    const data = {
      ...req.body,
      hasUser: req.query.hasUser === 'true',
    };

    try {
      const result = await this.userService.createUser(data);
      await this.TimelineEventService.create({ user: result._id, template: timelineEnum.register });
      res.status(201).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async editUserById(req, res, next) {
    const data = {
      email: req.decodedToken.email,
      photo: req.body.photo,
      name: req.body.name,
      phone: req.body.phone,
      notificationToken: req.body.notificationToken,
      deviceId: req.body.deviceId,
      address: req.body.address,
      biography: req.body.biography,
      location: req.body.location,
    };
    try {
      const result = await this.userService.editUserById(data);
      res.status(200).json(result);
      return next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      return next();
    }
  }

  async editUserAddressById(req, res, next) {
    const data = {
      email: req.decodedToken.email,
      cep: req.body.cep,
      number: req.body.number,
      city: req.body.city,
      state: req.body.state,
      complement: req.body.complement,
    };

    try {
      const result = await this.userService.editUserAddressById(data);
      res.status(200).json(result);
      return next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      return next();
    }
  }

  async deleteUserLogic(req, res, next) {
    const { email } = req.decodedToken;

    try {
      const result = await this.userService.deleteUserLogically(email);
      res.status(200).json(result);
      return next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      return next();
    }
  }

  async getUserById(req, res, next) {
    const data = {
      id: req.params.id,
      email: req.decodedToken.email,
    };
    try {
      const result = await this.userService.getUser(data);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(404).json({ error: err.message });
      next();
    }
  }

  async getAnyUserById(req, res, next) {
    const data = {
      id: req.params.id,
    };
    try {
      const result = await this.userService.getAnyUser(data);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(404).json({ error: err.message });
      next();
    }
  }

  async updateUserLocationById(req, res, next) {
    const data = {
      email: req.decodedToken.email,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    };

    try {
      const result = await this.userService.updateUserLocationById(data);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async checkUserExistence(req, res, next) {
    let { userIdentifier } = req.params;

    if (!userIdentifier) {
      userIdentifier = req.decodedToken.email;
    }

    try {
      const result = await this.userService.checkUserExistence(userIdentifier);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(404).json({ error: err.message });
      next();
    }
  }

  async getUserGroupRiskList(req, res, next) {
    res.status(200).json(riskGroups);
    next();
  }
}

module.exports = UserController;
