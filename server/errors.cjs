class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const createError = (message, statusCode = 500) => {
    return new HttpError(message, statusCode);
};

module.exports = {
    HttpError,
    createError
}; 