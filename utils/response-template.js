// Handle Success Response
module.exports.successResponse = (res, data = {}, message = "Success") => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
}

// Handle Error Responses
module.exports.errorResponse = (res, statusCode = 500, data = {} , error = "Error") => {
  return res.status(statusCode).json({
    success: true,
    error,
    data
  });
}
