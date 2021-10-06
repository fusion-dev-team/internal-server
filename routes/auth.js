const controller = require('../controllers/auth');
const validator = require('../validators');
const isAuthorized = require('../middlewares/isAuthorized');
// const uniqueLogin = require('../middlewares/uniqueLogin');
// const emailvalidation = require('../middlewares/emailValidation');
// const passwordCheck = require('../middlewares/passwordCheck');

module.exports = (router) => {
  router.post('/sign-in', validator.auth.signin, controller.singIn);
  router.post('/sign-up', validator.auth.signup, controller.singUp);
  router.post('/password-restore', validator.auth.passwordRestore, controller.passwordRestore);
  router.post('/password-reset', validator.auth.passwordReset, controller.passwordReset);
  router.get('/me', isAuthorized, controller.getUserByToken);
  router.post('/token-refresh', validator.auth.refreshToken, controller.tokenRefresh);
  router.post('/logout', controller.logout);
};
