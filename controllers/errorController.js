const AppError = require('./../utils/appError');

const developmentErrorRespose = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

const productionErrorResponse = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR !!!', err);
    // send generic message to the client
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong, please try again later!',
    });
  }
};

const handelCastErrorsDB = (error) => {
  return new AppError(`Invalid ${error.path}: ${error.value}`, 400);
};
const handelDuplicateErrorsDB = (error) => {
  return new AppError(
    `Duplicate Key on '${error.keyValue.name}', Please use another value!`,
    400,
  );
};
const handelValidationErrorDB = (error) => {
  let message = Object.values(error.errors)
    .map((err) => err.message)
    .join('.  ');
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    developmentErrorRespose(res, err);
  } else {
    let error = { ...err, name: err.name };
    if (error.name === 'CastError') e;
    rror = handelCastErrorsDB(error);
    if (error.code == 11000) error = handelDuplicateErrorsDB(error);
    if (error.name === 'ValidationError')
      error = handelValidationErrorDB(error);

    productionErrorResponse(res, error);
  }
};
