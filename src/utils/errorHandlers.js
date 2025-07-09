const handleControllerError = ({
  res,
  error,
  status = 400,
  reqType = 'Request',
  controllerName = 'Not specified',
  action = 'Not specified'
}) => {
  return res.status(status).json({
    error: {
      type: `${reqType} failed`,
      controller: controllerName,
      action: action,
      message: error.message
    }
  });
};

module.exports = handleControllerError;
