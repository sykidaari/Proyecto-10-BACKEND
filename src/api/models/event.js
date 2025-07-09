const mongoose = require('mongoose');
const requiredString = require('../../utils/modelsUtils');

const eventSchema = new mongoose.Schema(
  {
    title: { ...requiredString, minlength: 3, maxlength: 100 },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value > Date.now(),
        message: 'Event date must be in the future'
      }
    },
    location: {
      address: requiredString,
      city: requiredString,
      postalCode: requiredString,
      country: requiredString
    },
    description: { ...requiredString, minlength: 10, maxlength: 2000 },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    attendants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      }
    ],
    imgs: { type: String, trim: true }
  },
  { timestamps: true, collection: 'events' }
);

const Event = mongoose.model('event', eventSchema, 'events');

module.exports = Event;
