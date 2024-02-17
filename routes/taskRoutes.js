const express = require('express');
const taskController = require('./../controllers/taskController');
const activityRouter = require('./../routes/activityRoutes');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use('/:taskId/activities', activityRouter);

router.use(authController.protect);

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(taskController.setTask, taskController.createTask);
router
  .route('/:id')
  .delete(taskController.deleteTask)
  .patch(taskController.updateTask);
module.exports = router;
