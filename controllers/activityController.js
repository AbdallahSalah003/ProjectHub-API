const Activity = require('./../models/activityModel');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.setActivity = catchAsyncError(async (req, res, next) => {
  const contributer = await User.findOne({ email: req.body.contributer });
  if (!contributer) {
    return next(
      new AppError('Activity contributer in not registered on system', 404),
    );
  }
  req.body.task = req.params.taskId;
  req.body.contributer = contributer._id;
  next();
});
exports.AddActivity = factory.createOne(Activity);

exports.getAllActivities = factory.getAll(Activity);

exports.deleteActivity = factory.deleteOne(Activity);

exports.updateActivity = factory.updateOne(Activity);

exports.getOneActivity = factory.getOne(Activity);
