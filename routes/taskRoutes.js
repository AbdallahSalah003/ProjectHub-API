const express = require('express');
const taskController = require('./../controllers/taskController');
const activityRouter = require('./../routes/activityRoutes');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use('/:taskId/activities', activityRouter);

router.use(authController.protect);

router.get('/statistics', taskController.getTaskStats);
router.get(
  '/get-my-tasks',
  taskController.getMyTasks,
  taskController.getAllTasks,
);
router
  .route('/')
  .get(taskController.getAllTasks)
  .post(taskController.setTask, taskController.createTask);
router
  .route('/:id')
  .get(taskController.getOneTask)
  .delete(taskController.deleteTask)
  .patch(taskController.updateTask);
module.exports = router;
