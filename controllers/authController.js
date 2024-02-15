const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');

const signToken = (_id) => {
  return jwt.sign({ id: _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOpts = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    secure: false,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOpts.secure = true;

  res.cookie('jwt', token, cookieOpts);
  user.password = undefined; //prevent leak the password info
  res.status(statusCode).json({
    status: 'success',
    token,
    body: {
      user,
    },
  });
};

exports.signup = catchAsyncError(async (req, res) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide both email and password to login',
    });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid email or password',
    });
  }
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsyncError(async (req, res, next) => {
  //1) Getting token and check if its true
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'please login to have access',
    });
  }
  //2) Verification of the token
  const payload = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );
  //3) Verify that the user already exists
  const currentUser = await User.findById(payload.id);
  if (!currentUser) {
    return res.status(401).json({
      status: 'fail',
      message: 'The user which own this token is no longer exists',
    });
  }
  //4) check if User change the password after the token has been issued
  if (currentUser.changePasswordAfter(payload.iat)) {
    return res.status(401).json({
      status: 'fail',
      message: 'The user has recently changed the password, please login again',
    });
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You dont have the permission for this action',
      });
    }
    next();
  };
};
