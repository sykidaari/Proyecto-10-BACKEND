const mongoose = require('mongoose');
const requiredString = require('../../utils/modelsUtils');
const Event = require('./event');
const deleteCloudinaryImg = require('../../utils/cldImageDeleter');
const bcrypt = require('bcrypt');

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
  { timestamps: true, collection: 'users' }
);

userSchema.post('findOneAndDelete', async function (user) {
  if (user) {
    await Event.updateMany(
      { attendants: user._id },
      { $pull: { attendants: user._id } }
    );

    const userEvents = await Event.find({ creator: user._id });

    for (const event of userEvents) {
      if (event.imgs && event.imgs.length > 0) {
        for (const img of event.imgs) {
          deleteCloudinaryImg(img);
        }
      }
    }

    await Event.deleteMany({ creator: user._id });
  }
});

userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10);
});

const User = mongoose.model('user', userSchema, 'users');

module.exports = User;
