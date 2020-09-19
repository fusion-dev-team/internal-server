const logger = require('./logger');

/**
 *
 * @param {*} err - error object
 * @param {*} req - request object
 * @param {*} res - response object
 */

exports.commonErrorHandler = (err, req, res) => {
  let errorStatus = err.status || 500;
  if (err.message === 'Validation error') {
    errorStatus = 400;
    err.errors = err.errors.map(error => ({
      msg: error.message,
      value: error.value,
      type: error.type
    }));
  }
  const errorBody = {
    text: `Sign-up error: ${err.message}`,
    routeName: req.originalUrl,
    payload: err.payload,
    user: req.user ? req.user.id : null
  };
  if (errorStatus >= 500) {
    logger.error(errorBody);
  } else {
    logger.warn(errorBody);
  }
  const response = {};
  if (err.errors) {
    response.errors = err.errors;
  } else {
    response.errors = [
      {
        msg: err.message
      }
    ];
  }
  return res.status(errorStatus).json(response);
};
