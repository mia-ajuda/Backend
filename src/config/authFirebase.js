const admin = require('firebase-admin');
const fs = require('fs');

if (process.env.FIREBASE_CONFIG_BASE_64) {
  const buffer = Buffer.from(process.env.FIREBASE_CONFIG_BASE_64, 'base64');
  fs.writeFileSync('./src/config/firebaseAuthConfig.js', buffer);
}

const firebaseAuthConfig = require('./firebaseAuthConfig');

const { databaseURL, config } = firebaseAuthConfig;

admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL,
});

module.exports = admin;
