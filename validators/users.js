const { query, body } = require('express-validator');

module.exports = {
  getAll: [
    query('limit', 'Invalid limit param')
      .optional()
      .isInt({ gte: 0 }),
    query('offset', 'Invalid offset param')
      .optional()
      .isInt({ gte: 0 })
  ],
  update: [
    body('email', 'Email has wrong format')
      .optional()
      .isEmail(),
    body('DoB', 'Wrong DoB')
      .optional()
      .isRFC3339()
  ]
};
