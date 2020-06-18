const admin = require('firebase-admin');

let firebaseConfig;
const enviroment = process.env.NODE_ENV;

if (enviroment === 'development') {
    firebaseConfig = require('./firebaseConfig-dev');
} else {
    firebaseConfig = require('./firebaseConfig');
}

const { databaseURL, config } = firebaseConfig;

admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL,
});

module.exports = admin;
