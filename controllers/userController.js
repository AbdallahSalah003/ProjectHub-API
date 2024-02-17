const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const factory = require('./handlerFactory');

exports.deleteMe = catchAsyncError(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateMe = catchAsyncError(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('You can update password through /updatePassword', 400),
    );
  }
  const allowedFields = ['name', 'email'];
  const filterBody = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) filterBody[key] = req.boy[key];
  });
  const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});
exports.getAllUsers = factory.getAll(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.getUser = catchAsyncError(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({
      status: 'fail',
      data: {},
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  }
});
