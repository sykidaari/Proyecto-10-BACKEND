const handleControllerError = ({
  res,
  error,
  status = 400,
  method = 'Request',
  controllerName = 'Not specified',
  action = 'Not specified'
}) => {
  return res.status(status).json({
    error: {
      type: `${method} failed`,
      controller: controllerName,
      action: action,
      message: error.message
    }
  });
};

module.exports = handleControllerError;
