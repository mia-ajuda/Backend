const admin = require('firebase-admin');
const firebaseConfigDev = require('./firebaseConfig-dev');
const firebaseConfigProd = require('./firebaseConfig');

let firebaseConfig;
const enviroment = process.env.NODE_ENV;
if (enviroment === 'production') {
  firebaseConfig = firebaseConfigProd;
} else {
  firebaseConfig = firebaseConfigDev;
}

const { databaseURL, config } = firebaseConfig;

admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL,
});

module.exports = admin;
