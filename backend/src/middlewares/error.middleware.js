// Importing modules
import ApiError from "../utils/ApiError.js";

// Handling all application errors
function errorHandler(error, req, res, _next) {
    const apiError = error instanceof ApiError
        ? error
        : new ApiError(500, error.message || "Internal server error");

    // Sending the error response
    res.status(apiError.statusCode || 500).json({
        success: false,
        message: apiError.message || "Internal server error",
    });
}

// Exporting error handler
export default errorHandler;