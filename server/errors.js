class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

function createError(message, statusCode) {
    return new HttpError(message, statusCode);
}

module.exports = {
    HttpError,
    createError
}; 