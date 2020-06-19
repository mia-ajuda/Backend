const admin = require('firebase-admin');

let firebaseConfig;
const enviroment = process.env.NODE_ENV;
if (enviroment === 'production') {
    firebaseConfig = require('./firebaseConfig');
} else {
    firebaseConfig = require('./firebaseConfig-dev');
}

const { databaseURL, config } = firebaseConfig;

admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL,
});

module.exports = admin;
