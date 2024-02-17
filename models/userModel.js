const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
    validate: [validator.isEmail, 'Invalid email address!'],
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
    default: 'user',
  },
  password: {
    type: String,
    validate: [
      validator.isStrongPassword,
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // we just need passwordConfirm for validation function
  // then set it to undefined
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangetAt = Date.now() - 1000;
  next();
});

userSchema.methods.isCorrectPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWT_TimeStamp) {
  if (this.passwordChangetAt) {
    const seconds = Date.parse(this.passwordChangetAt) / 1000;
    return JWT_TimeStamp < seconds;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha257')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpiresToken = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
