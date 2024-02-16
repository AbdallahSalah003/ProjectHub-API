const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  projectID: {
    type: mongoose.Types.ObjectId,
    ref: 'Project',
  },
  moderatorID: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  contributers: {
    type: [mongoose.Types.ObjectId],
    ref: 'User',
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
    validate: {
      validator: function (end_date) {
        return end_date > this.startDate;
      },
      message: 'Invalid start and end dates',
    },
  },
  status: {
    type: String,
    enum: {
      values: ['notStarted', 'progress', 'started', 'completed'],
      message: 'Invalid task status value',
    },
    default: 'notStarted',
  },
});

taskSchema.pre('save', function (next) {
  //if the task is already started before adding to app
  if (this.startDate < Date.now()) this.status = 'started';
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
