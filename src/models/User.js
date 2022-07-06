const mongoose = require('mongoose');
const { cpf } = require('cpf-cnpj-validator');
const Point = require('./Point');
const { riskGroupsEnum } = require('./RiskGroup');

const userSchema = new mongoose.Schema({
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
  birthday: {
    type: Date,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: (v) => cpf.isValid(v),
      message: (props) => `${props.value} não é um cpf válido`,
    },
  },
  riskGroup: {
    type: [String],
    enum: [...Object.keys(riskGroupsEnum)],
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
  ismentalHealthProfessional: {
    type: Boolean,
    default: false,
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
}, { collection: 'user' });

module.exports = mongoose.model('User', userSchema);
