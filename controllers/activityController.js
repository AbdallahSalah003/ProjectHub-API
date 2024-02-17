const Activity = require('./../models/activityModel');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const factory = require('./handlerFactory');

exports.setActivity = catchAsyncError(async (req, res, next) => {
  const contributer = await User.findOne({ email: req.body.contributer });
  req.body.taskID = req.params.taskId;
  req.body.contributerID = contributer._id;
  next();
});
exports.AddActivity = factory.createOne(Activity);

exports.getAllActivities = factory.getAll(Activity);

exports.deleteActivity = factory.deleteOne(Activity);

exports.updateActivity = factory.updateOne(Activity);
