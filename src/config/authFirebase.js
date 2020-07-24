const admin = require('firebase-admin');
const firebaseAuthConfig = require('./firebaseAuthConfig');

const { databaseURL, config } = firebaseAuthConfig;

admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL,
});

module.exports = admin;
