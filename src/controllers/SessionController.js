const SessionService = require("../services/SessionService");

class SessionController {
    constructor() {
        this.SessionService = new SessionService();
    }

    async signUp(req, res, next) {
        const data = {
          email: req.body.email,
          password: req.body.password
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

    async signIn(req, res, next) {
        const data = {
            email: req.body.email,
            password: req.body.password
        };

        try {
            const result = await this.SessionService.SignInUser(data);
            res.status(201).json(result);
            next();
        }
        catch (err) {
            res.status(400).json(err);
            next();
        }
    }

    
}

module.exports = SessionController;
