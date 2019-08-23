const { check } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'signin': {
      return [
        check('password', "password doesn't exists").exists(),
        check('login', 'Invalid login').exists()
      ];
    }
    case 'signup': {
      return [
        check('login', 'Login is missing').exists(),
        check('email', 'Email is missing').exists(),
        check('email', 'Email has wrong format').isEmail(),
        check('password', 'Password is missing').exists()
      ];
    }
    default: {
      return [];
    }
  }
};
