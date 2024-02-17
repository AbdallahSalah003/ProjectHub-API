const AppError = require('./../utils/appError');

const developmentErrorRespose = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    developmentErrorRespose(res, err);
  } else {
    //Error In Production needs to be handeled
    res.status(err.statusCode).json({
      status: err.status,
      message: 'An error occured!',
    });
  }
};
