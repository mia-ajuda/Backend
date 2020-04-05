const jwt = require('jsonwebtoken');
const { promisify } = require('util');

async function isAuthenticated(req, res, next) {
  if(!req.headers.authorization) {
    throw {error: 'There is no token'};
  }

  let token = req.headers.authorization.split(' ')[1];
  
  if (token) {

      try {
        // verify makes sure that the token hasn't expired and has been issued by us
        const decode = promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // save token in requisition variabl
        req.decoded = decode;
        return next();
      } catch (err) {
        // Throw an error just in case anything goes wrong with verification
        res.status(403);
        throw {error: 'Token not match'};
      }

  } else {
      throw {error: 'Not Authorized'};

  }
}

module.exports = isAuthenticated;