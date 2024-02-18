const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    requierd: [true, 'Activity must has name'],
    minLength: [8, 'Activity name must be at least 8 charachters'],
    maxLength: [40, 'Activity name is at most 40 charachters'],
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
    trim: true,
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
