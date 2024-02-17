const util = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

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

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email', 404));
  }
  const resetToken = user.createPasswordResetToken();
  // no validation needed just save resetToken
  user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? submit a patch request with your new password and passwordConfirm to: ${resetURL}.
  If you don't forgot your password please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset your password token. (Valid only for 10 mins)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Email has been sent',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresToken = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending email. please try again later',
        500,
      ),
    );
  }
});
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const encryptResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: encryptResetToken,
    passwordResetExpiresToken: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError(
        'The token is wrong or may be expired. please try again later',
        400,
      ),
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpiresToken = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const LogedInUser = await User.findById(req.user.id).select('+password');

  if (
    !(await LogedInUser.isCorrectPassword(
      req.body.currentPassword,
      LogedInUser.password,
    ))
  ) {
    return next(
      new AppError(
        'Your password is Invalid. you can reset your password if you forgot it!',
        400,
      ),
    );
  }
  LogedInUser.password = req.body.password;
  LogedInUser.passwordConfirm = req.body.passwordConfirm;
  await LogedInUser.save();

  createAndSendToken(LogedInUser, 200, res);
});
