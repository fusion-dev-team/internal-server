const controller = require('../controllers/auth');
const validator = require('../validators/auth');
// const uniqueLogin = require('../middlewares/uniqueLogin');
// const emailvalidation = require('../middlewares/emailValidation');
// const passwordCheck = require('../middlewares/passwordCheck');

module.exports = (router) => {
  router.post('/sign-in', validator.validate('signin'), controller.singIn);
  router.post('/sign-up', validator.validate('signup'), controller.singUp);
  // router.post('/authorize', controller.authorize);
  // router.post('/password_restore', controller.passwordRestore);
  // router.post('/reset/:token', controller.passwordReset);
};
