const controller = require('../controllers/auth');
const validators = require('../validators');
const isAuthorized = require('../middlewares/isAuthorized');
// const uniqueLogin = require('../middlewares/uniqueLogin');
// const emailvalidation = require('../middlewares/emailValidation');
// const passwordCheck = require('../middlewares/passwordCheck');

module.exports = (router) => {
  router.post('/sign-in', validators('auth.signin'), controller.singIn);
  router.post('/sign-up', validators('auth.signup'), controller.singUp);
  router.post('/password-restore', validators('auth.password-restore'), controller.passwordRestore);
  router.post('/password-reset', validators('auth.password-reset'), controller.passwordReset);
  router.get('/me', isAuthorized, controller.getUserByToken);
  router.post('/token-refresh', validators('auth.refreshToken'), controller.tokenRefresh);
};
