
class APIError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Error handler middleware
const errorHandler = ((err, req, res, next) => {
    if (err instanceof APIError) {
        console.error(`API Error in ${req.method} ${req.originalUrl}: ${err.message}`);
        res.status(err.statusCode).json({ error: err.message });
    } else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(`JSON Parsing Error in ${req.method} ${req.originalUrl}: ${err.message}`);
        res.status(400).json({ error: 'Invalid JSON' });
    } else if (err.code === 'ENOTFOUND') {
        console.error(`DNS Lookup Error: ${err.message}`);
        res.status(500).json({ error: 'Service unavailable' });
    } else if (err.name === 'ValidationError') {
        console.error(`Validation Error: ${err.message}`);
        res.status(400).json({ error: err.message });
    } else if (err.name === 'UnauthorizedError') {
        console.error(`Unauthorized Error: ${err.message}`);
        res.status(401).json({ error: 'Unauthorized' });
    } else {
        console.error(`Unexpected Error in ${req.method} ${req.originalUrl}: ${err.stack}`);
        res.status(+err.status || 500).json({ message: err.message || 'Internal Server Error' });
    }
});

function ErrorMsg(message, status) {
    const error = new Error();
    error.httpStatus = status;
    error.status = status;
    error.message = message;
    return error;
}

module.exports = {
    ErrorMsg,
    errorHandler
}