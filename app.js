const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const userRouter = require('./routes/userRoutes');
const projecRouter = require('./routes/projectRoutes');
const taskRouter = require('./routes/taskRoutes');
const activityRouter = require('./routes/activityRoutes');
const GlobalErrorHandler = require('./controllers/errorController');
const app = express();

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limitter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('./api', limitter);

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());
app.use(xss());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/projects', projecRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/activities', activityRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
  );
  next(err);
});

app.use(GlobalErrorHandler);

module.exports = app;
