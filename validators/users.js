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
    body('email', 'Email is missing').exists(),
    body('email', 'Email has wrong format').isEmail(),
    body('DoB', 'Wrong DoB').isRFC3339(),
    body('firstName').exists(),
    body('lastName').exists()
  ]
};
