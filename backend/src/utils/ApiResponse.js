// Creating a standard API response
function ApiResponse(res, statusCode, message, data = null) {

    // sending the response
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });

}

// Exporting API response
export default ApiResponse;