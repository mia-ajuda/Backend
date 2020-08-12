const EntityService = require('../services/EntityService');
const saveError = require('../utils/ErrorHistory');

class EntityController {
  constructor() {
    this.entityService = new EntityService();
  }

  async createEntity(req, res, next) {
    const { latitude, longitude } = req.body;

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    const data = {
      location,
      ...req.body,
      hasEntity: req.query.hasEntity === 'true',
    };

    try {
      const result = await this.entityService.createEntity(data);
      res.status(201).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async editEntityById(req, res, next) {
    const data = {
      email: req.decodedToken.email,
      photo: req.body.photo,
      name: req.body.name,
      phone: req.body.phone,
      notificationToken: req.body.notificationToken,
      deviceId: req.body.deviceId,
    };
    try {
      const result = await this.entityService.editEntityById(data);
      res.status(200).json(result);
      return next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      return next();
    }
  }

  async editEntityAddressById(req, res, next) {
    const data = {
      email: req.decodedToken.email,
      cep: req.body.cep,
      number: req.body.number,
      city: req.body.city,
      state: req.body.state,
      complement: req.body.complement,
    };

    try {
      const result = await this.entityService.editEntityAddressById(data);
      res.status(200).json(result);
      return next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      return next();
    }
  }

  async deleteEntityLogic(req, res, next) {
    const { email } = req.decodedToken;

    try {
      const result = await this.entityService.deleteEntityLogically(email);
      res.status(200).json(result);
      return next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      return next();
    }
  }

  async getEntityById(req, res, next) {
    const data = {
      id: req.params.id,
      email: req.decodedToken.email,
    };

    try {
      const result = await this.entityService.getEntity(data);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(404).json({ error: err.message });
      next();
    }
  }

  async updateEntityLocationById(req, res, next) {
    const data = {
      email: req.decodedToken.email,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    };

    try {
      const result = await this.entityService.updateEntityLocationById(data);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async checkEntityExistence(req, res, next) {
    let { entityIdentifier } = req.params;

    if (!entityIdentifier) {
      entityIdentifier = req.decodedToken.email;
    }

    try {
      const result = await this.entityService.checkEntityExistence(entityIdentifier);
      res.status(200).json(result);
      next();
    } catch (err) {
      saveError(err);
      res.status(404).json({ error: err.message });
      next();
    }
  }
}

module.exports = EntityController;
