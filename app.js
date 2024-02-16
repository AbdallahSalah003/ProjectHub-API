const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const projecRouter = require('./routes/projectRoutes');
const taskRouter = require('./routes/taskRoutes');
const app = express();

app.use(express.json({ limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/users', userRouter);
app.use('/api/v1/projects', projecRouter);
app.use('/api/v1/tasks', taskRouter);

module.exports = app;
