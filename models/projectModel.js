const mongoose = require('mongoose');
const validator = require('validator');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  ownweID: {
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
  },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
