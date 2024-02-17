const Activity = require('./../models/activityModel');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');

exports.AddActivity = catchAsyncError(async (req, res) => {
  const contributer = await User.findOne({ email: req.body.contributer });
  const newActivity = await Activity.create({
    ...req.body,
    taskID: req.params.taskId,
    contributerID: contributer._id,
  });
  res.status(201).json({
    status: 'success',
    data: {
      Activity: newActivity,
    },
  });
});
exports.getAllActivities = catchAsyncError(async (req, res) => {
  const activities = await Activity.find({ taskID: req.params.taskId });
  res.status(200).json({
    status: 'success',
    data: {
      activities,
    },
  });
});
exports.deleteActivity = catchAsyncError(async (req, res) => {
  await Activity.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: 'success',
    data: null,
  });
});
exports.updateActivity = catchAsyncError(async (req, res) => {
  const activity = await Activity.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: {
      activity,
    },
  });
});
