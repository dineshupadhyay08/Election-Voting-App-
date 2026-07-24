class HttpError extends Error {
    constructor(message, statusCode) {
        this.statusCode = statusCode;
    }
}

module.exports = HttpError;
