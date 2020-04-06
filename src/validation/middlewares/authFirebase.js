const admin = require('../../config/authFirebase');

const isAuthenticated = (req, res, next) => {  
  
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    let token = req.headers.authorization.split(' ')[1];

    console.log(token)
  
    admin.auth()
    .verifyIdToken(token).then(decodeToken => {
      console.log('enter');
      req.authId = decodeToken.uid;
      return next();
    })
    .catch(error => {
      return res
        .status(401)
        .json({ error: 'User not authoreized' });
    })
  } 
};

module.exports = isAuthenticated;