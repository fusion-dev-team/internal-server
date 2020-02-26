const controller = require('../controllers/auth');
const validators = require('../validators');

module.exports = (router) => {
  router.post('/sign-in', validators('auth.signin'), controller.singIn);
  router.post('/sign-up', validators('auth.signup'), controller.singUp);
  router.post('/token-refresh', validators('auth.refreshToken'), controller.tokenRefresh);
};
