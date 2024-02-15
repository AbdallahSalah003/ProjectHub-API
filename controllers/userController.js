const User = require('./../models/userModel');
const catchAsyncErrors = require('./../utils/catchAsyncError');

exports.getAllUsers = catchAsyncErrors(async (req, res) => {
  const users = await User.find();
  if (!users) {
    res.status(404).json({
      status: 'fail',
      data: {},
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: { users },
    });
  }
});
exports.addUser = catchAsyncErrors(async (req, res) => {
  const user = await User.create(req.body);
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
exports.getUser = catchAsyncErrors(async (req, res) => {
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
exports.updateUser = catchAsyncErrors(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

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
exports.deleteUser = catchAsyncErrors(async (req, res) => {
  const user = await User.findByIdDelete(req.params.id);
  if (!user) {
    res.status(404).json({
      status: 'fail',
      data: {},
    });
  } else {
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
});
