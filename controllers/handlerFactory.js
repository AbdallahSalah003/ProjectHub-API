const catchAsyncError = require('./../utils/catchAsyncError');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeaturs');

exports.getAll = (Model) =>
  catchAsyncError(async (req, res, next) => {
    // this is for getting the nested get
    let filterObj = {};
    if (req.params.taskId) filterObj = { taskID: req.params.taskId };
    if (req.params.projectId)
      filterObj = { ...filterObj, projectID: req.params.projectId };

    const features = new APIFeatures(Model.find(filterObj), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { docs },
    });
  });

exports.deleteOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('This document ID is not found!', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('This document ID is not found!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    });
  });
exports.getOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    let doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError('This document ID is not found!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
