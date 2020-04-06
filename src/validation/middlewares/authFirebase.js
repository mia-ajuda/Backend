const admin = require('../../config/authFirebase');

const isAuthenticated = async (req, res, next) => {  
  
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const idToken = await admin.auth().verifyIdToken(token)
            req.decodedToken = idToken
            return next();
        } catch {
            return res.status(401).json({ error: 'User not authorized' });
        }
    }
    return res.status(403).json({ error: 'User not authenticated' });
};

module.exports = isAuthenticated;