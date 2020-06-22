const admin = require('../../config/authFirebase');

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization
        && req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      const idToken = await admin.auth().verifyIdToken(token);
      req.decodedToken = idToken;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Usuário não autorizado' });
    }
  }
  return res.status(403).json({ error: 'Usuário não está autenticado' });
};

module.exports = isAuthenticated;
