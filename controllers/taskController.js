const Task = require('./../models/taskModel');
const Project = require('./../models/projectModel');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');

exports.createTask = catchAsyncError(async (req, res) => {
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
  const newTask = await Task.create(task);
  res.status(201).json({
    status: 'success',
    data: {
      Task: newTask,
    },
  });
});
exports.getAllTasks = catchAsyncError(async (req, res) => {
  const tasks = await Task.find({ projectID: req.params.projectID });
  res.status(200).json({
    status: 'success',
    data: {
      tasks,
    },
  });
});
exports.deleteTask = catchAsyncError(async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: 'success',
    data: null,
  });
});
exports.updateTask = catchAsyncError(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});
