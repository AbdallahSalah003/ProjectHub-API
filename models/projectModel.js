const mongoose = require('mongoose');
const validator = require('validator');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    requierd: [true, 'Project must has a name'],
    minLength: [8, 'Project name must be at least 8 charachters'],
    maxLength: [40, 'Project name is at most 40 charachters'],
  },
  ownerID: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  clients: {
    type: [String],
    validate: {
      validator: function (val) {
        return val.every((el) => validator.isEmail(el));
      },
      message: 'Invalid clients emails',
    },
  },
  description: {
    type: String,
    trim: true,
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
      values: ['notStarted', 'started', 'completed', 'cancelled'],
      message: 'Invalid status value',
    },
    default: 'notStarted',
  },
});

projectSchema.pre('save', function (next) {
  //if the project is already started before adding to app
  if (this.startDate < Date.now()) this.status = 'started';
  next();
});
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
