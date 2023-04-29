const mongoose = require('mongoose');
const { cnpj } = require('cpf-cnpj-validator');
const Point = require('./Point');

const entitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    cnpj: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: {
        validator: (v) => cnpj.isValid(v),
        message: (props) => `${props.value} não é um cnpj válido`,
      },
    },
    photo: {
      type: String,
    },
    notificationToken: {
      type: String,
    },
    address: {
      cep: {
        type: String,
      },
      number: {
        type: Number,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      complement: String,
    },
    location: {
      type: Point,
      index: '2dsphere',
    },
    phone: {
      type: String,
    },
    registerDate: {
      type: Date,
      default: Date.now,
    },
    active: {
      default: true,
      type: Boolean,
    },
    biography: {
      default: '-',
      type: String,
    },
  },
  { collection: 'entity' },
);

module.exports = mongoose.model('Entity', entitySchema);
