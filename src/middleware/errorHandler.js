function errorHandler(error, req, res, next) {
  console.error(error.message);

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500
    ? "Internal server error"
    : error.message;

  return res.status(statusCode).json({
    success: false,
    message
  });
}

module.exports = errorHandler;
