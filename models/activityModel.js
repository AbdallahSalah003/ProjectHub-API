const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  taskID: {
    type: mongoose.Types.ObjectId,
    ref: 'Task',
  },
  contributerID: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
  },
  deadline: {
    type: Date,
  },
  status: {
    type: String,
    enum: {
      values: ['progress', 'finished'],
    },
  },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
