const controller = require('../controllers/auth');
const validators = require('../validators');
// const uniqueLogin = require('../middlewares/uniqueLogin');
// const emailvalidation = require('../middlewares/emailValidation');
// const passwordCheck = require('../middlewares/passwordCheck');

module.exports = (router) => {
  router.post('/sign-in', validators('auth.signin'), controller.singIn);
  router.post('/sign-up', validators('auth.signup'), controller.singUp);
  // router.post('/authorize', controller.authorize);
  // router.post('/password-restore', controller.passwordRestore);
  // router.post('/password-restore/:token', controller.passwordReset);
  router.post('/token-refresh', validators('auth.refreshToken'), controller.tokenRefresh);
};
