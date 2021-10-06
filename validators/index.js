const { validationResult, matchedData } = require('express-validator');
/**
 * validator[fileName][validatorName]
 */
const validator = require('require-directory')(module);

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    req.body = matchedData(req, { locations: ['body'] });
    req.query = matchedData(req, { locations: ['query'] });
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

Object.keys(validator).forEach((fileName) => {
  Object.keys(validator[fileName]).forEach((key) => {
    validator[fileName][key] = [...validator[fileName][key], validate];
  });
});

module.exports = validator;
