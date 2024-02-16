const express = require('express');
const authController = require('./../controllers/authController');
const projectController = require('./../controllers/projectController');
const taskRouter = require('./../routes/taskRoutes');

const router = express.Router();

router.use(authController.protect);

router.use('/:projectID/tasks', taskRouter);

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route('/:id')
  .delete(projectController.deleteProject)
  .patch(projectController.updateProject);

module.exports = router;
