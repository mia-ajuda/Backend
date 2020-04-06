
const admin = require("firebase-admin");

const serviceAccount = require("./authmiaajuda-firebase-adminsdk-8ua3y-cf5480874b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://authmiaajuda.firebaseio.com"
});

module.exports = admin;
