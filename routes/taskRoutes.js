const express = require('express');
const taskController = require('./../controllers/taskController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.use(authController.protect);

router
  .route('/:projectID')
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

module.exports = router;
