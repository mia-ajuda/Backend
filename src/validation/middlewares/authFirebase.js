const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    req.token = req.headers.authorization.split(' ')[1];
  } else {
    req.authToken = null;
  }
  next();
};


export const isAuthenticated = (req, res, next) => {
 getAuthToken(req, res, async () => {
    try {
      const { token } = req;
      const userInfo = await admin
        .auth()
        .verifyIdToken(token);
      req.authId = userInfo.uid;
      return next();
    } catch (err) {
      return res
        .status(401)
        .send({ error: 'You are not authorized' });
    }
  });
};

module.exports = isAuthenticated;