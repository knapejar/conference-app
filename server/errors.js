export class HttpError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'HttpError';
    }
}

export const createError = (message, statusCode = 500) => {
    return new HttpError(message, statusCode);
}; 