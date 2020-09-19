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
    check('to', 'Wrong date "to" field').optional().isISO8601(),
    check('from', 'Wrong date "from" field').optional().isISO8601()
  ]
};
