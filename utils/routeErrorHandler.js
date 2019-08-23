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
  if (errorStatus >= 500) {
    logger.error({ text: `Sign-up error: ${err.message}`, routeName: req.originalUrl });
  } else {
    logger.warn({ text: `Sign-up error: ${err.message}`, routeName: req.originalUrl });
  }

  return res.status(errorStatus).json({
    message: err.message,
    errors: err.errors
  });
};
