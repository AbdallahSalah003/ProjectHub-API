const Task = require('./../models/taskModel');
const Project = require('./../models/projectModel');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const factory = require('./handlerFactory');

exports.setTask = catchAsyncError(async (req, res, next) => {
  const moderator = await User.findOne({ email: req.body.moderatorEmail });
  let contributers = [];
  req.body.contributers.forEach((el) => {
    contributers.push(User.findOne({ email: el }));
  });
  contributers = (await Promise.all(contributers)).map((el) => el._id);
  const task = {
    projectID: req.params.projectID,
    moderatorID: moderator._id,
    name: req.body.name,
    contributers: contributers,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };
  req.body = task;
  next();
});

exports.createTask = factory.createOne(Task);

exports.getAllTasks = factory.getAll(Task);

exports.deleteTask = factory.deleteOne(Task);

exports.updateTask = factory.updateOne(Task);
