const mongoose = require('mongoose');
const { cnpj } = require('cpf-cnpj-validator');
const Point = require('./Point');

const entitySchema = new mongoose.Schema({
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
    required: true,
  },
  notificationToken: {
    type: String,
  },
  address: {
    cep: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    complement: String,
  },
  location: {
    type: Point,
    index: '2dsphere',
  },
  phone: {
    type: String,
    required: true,
  },
  registerDate: {
    type: Date,
    default: Date.now,
  },
  active: {
    default: true,
    type: Boolean,
  },
}, { collection: 'entity' });

module.exports = mongoose.model('Entity', entitySchema);
