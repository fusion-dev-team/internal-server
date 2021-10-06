const controller = require('../controllers/requests');
const isAuthorize = require('../middlewares/isAuthorized');
const validator = require('../validators');
// const isAdmin = require('../middlewares/isAdmin');
// const isSalesOrManager = require('../middlewares/isSalesOrManager');

module.exports = (router) => {
  router.use(isAuthorize);

  router.post('/', validator.requests.create, controller.postRequest);
  // router.put('/', controller.putRequest);
  // router.get('/', isSalesOrManager, controller.getRequests);
  router.get('/user/:id', validator.requests.getAll, controller.getRequestsForUser);
  // router.delete('/:id', isAdmin, controller.deleteRequest);
};
