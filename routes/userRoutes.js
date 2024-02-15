const express = require('express');
const usersController = require('./../controllers/userController');

const router = express.Router();

router.route('/').get(usersController.getAllUsers);

router
  .route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
