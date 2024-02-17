const express = require('express');
const usersController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
// router.use(authController.restrictTo('admin'));
router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateMe', usersController.updateMe);
router.delete('/deleteMe', usersController.deleteMe);

router.route('/').get(usersController.getAllUsers);

router
  .route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
