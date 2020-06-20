const admin = require('firebase-admin');
const { config, databaseURL } = require('./firebaseConfig');

admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL,
});

module.exports = admin;
