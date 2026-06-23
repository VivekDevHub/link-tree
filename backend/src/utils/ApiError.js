// Creating custom API error class
class ApiError extends Error {
    constructor(
        statusCode,
        message
    ) {
        super(message);

        // Setting error response fields
        this.statusCode = statusCode;
        this.message = message;
    }
}

// Exporting API error class
export default ApiError;