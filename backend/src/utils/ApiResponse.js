function ApiResponse(res, statusCode, message, data = null) {
  //sending response
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export default ApiResponse;
