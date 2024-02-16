const express = require('express');
const taskController = require('./../controllers/taskController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(taskController.createTask);
router
  .route('/:taskId')
  .delete(taskController.deleteTask)
  .patch(taskController.updateTask);
module.exports = router;
