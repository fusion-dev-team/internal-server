const { check } = require('express-validator');

module.exports = {
  create: [
    check('title', 'Missing title').exists(),
    check('dateTo', 'Missing dateTo').exists().isISO8601(),
    check('dateFrom', 'Missing dateTo').optional().isISO8601(),
    check('type', 'Missing type').exists(),
    check('comment', 'Missing comment').exists()
  ],
  getAll: [
    check('login', 'Login is missing').exists(),
    check('email', 'Email is missing').exists(),
    check('email', 'Email has wrong format').isEmail(),
    check('password', 'Password is missing').exists()
  ],
  getOne: [
    check('email', 'Email is missing').exists(),
    check('email', 'Email has wrong format').isEmail()
  ]
};
