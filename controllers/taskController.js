const Task = require('./../models/taskModel');
const Project = require('./../models/projectModel');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

const setModerator = async (req, next) => {
  const moderator = await User.findOne({ email: req.body.moderatorEmail });
  if (!moderator) {
    return next(
      new AppError('Task moderator is not registered on system', 404),
    );
  }
  return moderator;
};
const setContributers = async (req, next) => {
  let contributers = [];
  req.body.contributers.forEach((el) => {
    contributers.push(User.findOne({ email: el }));
  });
  contributers = (await Promise.all(contributers)).map((el) => {
    if (!el) {
      return next(
        new AppError("Task's contributers are not registered on system", 404),
      );
    }
    return el._id;
  });
  return contributers;
};
exports.setTask = catchAsyncError(async (req, res, next) => {
  const moderator = await setModerator(req, next);
  const contributers = await setContributers(req, next);

  const task = {
    ...req.body,
    project: req.params.projectID,
    moderator: moderator._id,
    contributers: contributers,
  };

  req.body = task;
  next();
});

exports.getMyTasks = (req, res, next) => {
  req.myTasks = true;
  next();
};
exports.createTask = factory.createOne(Task);

exports.getAllTasks = factory.getAll(Task);

exports.deleteTask = factory.deleteOne(Task);

exports.updateTask = factory.updateOne(Task);

exports.getOneTask = factory.getOne(Task);

exports.getTaskStats = catchAsyncError(async (req, res, next) => {
  console.log(req.params.projectID);
  const stats = await Task.aggregate([
    {
      $match: {
        project: req.params.projectID,
      },
    },
    {
      $group: {
        _id: { $toUpper: '$status' },
        numberOfActivities: { $sum: 1 },
      },
    },
    {
      $sort: { numberOfActivities: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
