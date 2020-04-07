const mongoose = require("mongoose");
const HelpService = require("../services/HelpService");

class HelpController {
  constructor() {
    this.HelpService = new HelpService();
  }

  async createHelp(req, res, next) {
    const data = {
      ...req.body,
    };
    try {
      const result = await this.HelpService.createHelp(data);
      res.status(201);
      res.json(result);
      next();
    } catch (err) {
      res.status(400);
      res.send(err);
      next();
    }
  }

  async getHelpById(req, res, next) {
    const { id } = req.params;
    try {
      const result = await this.HelpService.getHelpByid(id);
      res.status(200);
      res.json(result);
      next();
    } catch (err) {
      res.status(400);
      res.json(err);
      next();
    }
  }

  async getHelpList(req, res, next) {
    const except = !!req.query["id.except"];
    const helper = !!req.query["id.helper"];
    const temp = except ? "except" : helper ? "helper" : null;
    const id = temp ? req.query[`id.${temp}`] : req.query.id;
    const status = req.query.status || null;
    const near = req.query.near || false;
    const coords = near
      ? req.query.coords.split(",").map((coord) => Number(coord))
      : null;

    try {
      let result;

      if (near) {
        result = await this.HelpService.getNearHelpList(coords);
      } else {
        result = await this.HelpService.getHelpList(id, status, except, helper);
      }
      res.status(200);
      res.json(result);
      next();
    } catch (err) {
      res.status(400);
      res.json(err);
      next();
    }
  }
}

module.exports = HelpController;
