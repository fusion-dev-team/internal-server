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
    body('login', 'Login is missing').exists(),
    body('email', 'Email is missing').exists(),
    body('email', 'Email has wrong format').isEmail(),
    body('password', 'Password is missing').exists()
  ]
};
