const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const userRouter = require('./routes/userRoutes');
const projecRouter = require('./routes/projectRoutes');
const taskRouter = require('./routes/taskRoutes');
const activityRouter = require('./routes/activityRoutes');
const GlobalErrorHandler = require('./controllers/errorController');
const app = express();

app.use(helmet());

app.use(express.json({ limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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
