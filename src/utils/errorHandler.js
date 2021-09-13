const saveError = require('./ErrorHistory');

const errorHandler = (err, _req, res, _next) => {
    if(err instanceof GeneralError) {
        return res.status(err.getCode()).json({
            status: 'error',
            message: err.message
        });
    }

    saveError(err);
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
}

class GeneralError extends Error {
    constructor(msg) {
        super(msg);
    }

    getCode() {
        return this.code;
    }
}

class BadRequestError extends GeneralError {
    constructor(msg) {
        super(msg);
        this.code = 400;
        this.name = `BadRequestError:${msg}`;
    }
}

class UnauthorizedError extends GeneralError {
    constructor(msg) {
        super(msg);
        this.code = 401;
        this.name = `UnauthorizedError:${msg}`;
    }
}

class ForbiddenError extends GeneralError {
    constructor(msg) {
        super(msg);
        this.code = 403;
        this.name = `ForbiddenError:${msg}`;
    }
}

class NotFoundError extends GeneralError {
    constructor(msg) {
        super(msg);
        this.code = 404;
        this.name = `NotFoundError:${msg}`;
    }
}

class ConflictError extends GeneralError {
    constructor(msg) {
        super(msg);
        this.code = 409;
        this.name = `ConflictError:${msg}`;
    }
}

module.exports = {
    errorHandler,
    BadRequestError,
    ConflictError,
    ForbiddenError,
    GeneralError,
    NotFoundError,
    UnauthorizedError
};