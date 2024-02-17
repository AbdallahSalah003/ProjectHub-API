const express = require('express');
const activityRouter = require('./../routes/activityRoutes');
const activityController = require('./../controllers/activityController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.use('/:taskId/activities', activityRouter);

router
  .route('/')
  .get(activityController.getAllActivities)
  .post(activityController.AddActivity);

router
  .route('/:id')
  .patch(activityController.updateActivity)
  .delete(activityController.deleteActivity);

module.exports = router;
