const multer = require('multer');
const controller = require('../controllers/users');
const validators = require('../validators');
const isAuthorized = require('../middlewares/isAuthorized');
const isAdminOrOwner = require('../middlewares/isAdminOrOwner');
const isActiveUser = require('../middlewares/isActiveUser');

const upload = multer({ dest: './public/uploads/' });

module.exports = (router) => {
  router.use(isAuthorized);

  router.get('/', validators('users.getAll'), controller.getUsers);
  // router.get('/:login', controller.getUser);
  router.get('/:id', controller.getUser);
  router.put('/:id', isActiveUser, isAdminOrOwner, validators('users.update'), controller.editUser);
  router.put('/:id/avatar', isAdminOrOwner, upload.single('avatar'), controller.updateAvatar);
  //   // router.put('/adminChange/:id', isAdmin, controller.adminChange);
  //   router.delete('/:id', isAdmin, controller.deleteUser);
};
