const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  task: {
    type: mongoose.Types.ObjectId,
    ref: 'Task',
  },
  contributer: {
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
    default: 'progress',
  },
});
activitySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'contributer',
    select: '_id first_name email',
  }).populate({
    path: 'task',
    select: '_id name',
  });
  next();
});
const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
