const SessionService = require("../services/SessionService");

class SessionController {
    constructor() {
        this.SessionService = new SessionService();
    }

    async signUp(req, res, next) {
        const data = {
          email: req.body.email,
          password: req.body.password,
          phoneNumber: req.body.phoneNumber,
          photoUrl: req.body,photoUrl,
          displayName: req.body.name
        };

        try {
            const result = await this.SessionService.SignUpUser(data);
            res.status(201).json(result);
            next();
        }
        catch (err) {
            res.status(400).json(err);
            next();
        }
    }

    async teste(req, res, next) {
        return res.status(200).json({ teste: 'teste' });
    }
}

module.exports = SessionController;
