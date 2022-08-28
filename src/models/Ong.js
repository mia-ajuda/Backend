const mongoose = require('mongoose');
const { cnpj } = require('cpf-cnpj-validator');

const OngSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  site: {
    type: String,
    required: false,
  },
  dataAbertura: {
    type: Date,
    required: true,
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
  phone: {
    type: String,
  },
}, { collection: 'Ong' });

module.exports = mongoose.model('User', OngSchema);