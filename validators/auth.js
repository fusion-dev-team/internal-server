const { check } = require('express-validator');

module.exports = {
  signin: [
    check('password', "password doesn't exists").exists(),
    check('login', 'Invalid login').exists()
  ],
  signup: [
    check('login', 'Login is missing').exists(),
    check('email', 'Email is missing').exists(),
    check('email', 'Email has wrong format').isEmail(),
    check('password', 'Password is missing').exists()
  ],
  refreshToken: [check('refreshToken', 'refreshToken is missing').exists()]
};
