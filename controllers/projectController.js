const Project = require('./../models/projectModel');
// const catchAsyncError = require('./../utils/catchAsyncError');
const factory = require('./handlerFactory');

exports.setOwnerId = (req, res, next) => {
  req.body.ownerID = req.user.id;
  next();
};
exports.getProjectsFlag = (req, res, next) => {
  req.projs = true;
  next();
};
exports.createProject = factory.createOne(Project);

exports.getAllProjects = factory.getAll(Project);

exports.deleteProject = factory.deleteOne(Project);

exports.updateProject = factory.updateOne(Project);

exports.getOneProject = factory.getOne(Project);
