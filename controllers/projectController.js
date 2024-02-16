const Project = require('./../models/projectModel');
const catchAsyncError = require('./../utils/catchAsyncError');

exports.createProject = catchAsyncError(async (req, res) => {
  const newProject = await Project.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newProject,
    },
  });
});
exports.getAllProjects = catchAsyncError(async (req, res) => {
  const projects = await Project.find();
  res.status(200).json({
    status: 'success',
    data: {
      projects,
    },
  });
});
exports.deleteProject = catchAsyncError(async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: 'success',
    data: null,
  });
});
exports.updateProject = catchAsyncError(async (req, res) => {
  const project = Project.findByIdAndUpdate(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});
