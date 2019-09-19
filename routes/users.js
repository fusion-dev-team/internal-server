// // const multer = require('multer');
const controller = require('../controllers/users');

// // const upload = multer({ dest: './public/uploads/' });
// const uniqueLogin = require('../middlewares/uniqueLogin');
// // const userValidation = require('../middlewares/emailValidation');
// const validator = require('../validators/users');
const validators = require('../validators');
const isAuthorized = require('../middlewares/isAuthorized');
const isAdminOrOwner = require('../middlewares/isAdminOrOwner');
const isActiveUser = require('../middlewares/isActiveUser');

module.exports = (router) => {
  router.use(isAuthorized);

  router.get('/', validators('users.getAll'), controller.getUsers);
  // router.get('/:login', controller.getUser);
  router.get('/:id', controller.getUser);
  router.put('/:id', isActiveUser, isAdminOrOwner, validators('users.update'), controller.editUser);
  // router.put('/:id', controller.editUser);
  //   // router.put('/avatar/:id', upload.single('avatarIMG'), controller.newAvatar);
  //   // router.put('/adminChange/:id', isAdmin, controller.adminChange);
  //   router.delete('/:id', isAdmin, controller.deleteUser);
};
