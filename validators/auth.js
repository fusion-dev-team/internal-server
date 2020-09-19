const { check, cookie } = require('express-validator');

module.exports = {
  signin: [
    check('password', "password doesn't exists").exists(),
    check('login', 'Missing login').exists(),
    check('device', 'Missing device hash').exists()
  ],
  signup: [
    check('login', 'Login is missing').exists(),
    check('email', 'Email is missing').exists(),
    check('email', 'Email has wrong format').isEmail(),
    check('password', 'Password is missing').exists(),
    check('device', 'Missing device hash').exists()
  ],
  'password-restore': [
    check('email', 'Email is missing').exists(),
    check('email', 'Email has wrong format').isEmail()
  ],
  'password-reset': [
    check('token', 'Token is missing').exists(),
    check('password', 'Password is missing').exists()
  ],
  refreshToken: [
    cookie('refreshToken', 'refreshToken is missing').exists(),
    check('device', 'Missing device hash').exists()
  ]
};
