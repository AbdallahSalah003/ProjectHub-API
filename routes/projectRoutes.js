const express = require('express');
const authController = require('./../controllers/authController');
const projectController = require('./../controllers/projectController');

const router = express.Router();

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

module.exports = router;
