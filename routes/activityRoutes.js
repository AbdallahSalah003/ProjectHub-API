const express = require('express');
const activityController = require('./../controllers/activityController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(activityController.getAllActivities)
  .post(activityController.setActivity, activityController.AddActivity);
router.get(
  '/get-my-activities',
  activityController.getMyActivities,
  activityController.getAllActivities,
);
router
  .route('/:id')
  .get(activityController.getOneActivity)
  .patch(activityController.updateActivity)
  .delete(activityController.deleteActivity);

module.exports = router;
