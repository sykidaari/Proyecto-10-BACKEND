const mongoose = require('mongoose');
const requiredString = require('../../utils/modelsUtils');

const userSchema = new mongoose.Schema(
  {
    userName: {
      ...requiredString,
      unique: true,
      lowercase: true,
      match: /^(?![.])[a-z0-9._]+$/,
      minlength: 3,
      maxlength: 30
    },
    emailAddress: {
      ...requiredString,
      unique: true,
      lowercase: true,
      minlength: 3,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
    },
    password: { ...requiredString, minlength: 8, maxlength: 30 },

    role: {
      ...requiredString,
      enum: ['admin', 'user'],
      default: 'user'
    },

    img: { type: String, trim: true }
  },
  { timestamps: true, collection: true }
);

const User = mongoose.model('user', userSchema, 'users');

module.exports = User;
