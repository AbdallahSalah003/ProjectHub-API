const express = require('express');
const usersController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.use(authController.protect);
// router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.addUser);

router
  .route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
