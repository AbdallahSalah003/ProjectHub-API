const mongoose = require('mongoose');
const validatior = require('validator');
// const bcrypt = require('bcrypt');

userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'A user must have a username'],
    maxLength: [30, 'A user name must be at most 30 charachers length'],
    minLength: [8, 'A user name must be at least 10 characters length'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    lowercase: true,
    validate: [validatior.isEmail, 'Invalid email address!'],
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'role must be either user or admin',
    },
    required: [true, 'Please provide a role field'],
  },
  password: {
    type: String,
    validate: [
      validatior.isStrongPassword,
      'A password must be minLength: 8, ans must contian minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1',
    ],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function (value) {
        return this.password == value;
      },
      message: 'Please confirm your password correctly!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpiresToken: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
