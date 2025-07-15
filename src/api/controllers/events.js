const handleControllerError = require('../../utils/errorHandlers');
const Event = require('../models/event');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('user');

    return res.status(200).json(events);
  } catch (error) {
    handleControllerError({
      res,
      error,
      reqType: 'GET',
      controllerName: 'getEvents',
      action: 'fetch events from DB'
    });
  }
};
//! NEED TO ADD FILTERING

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return handleControllerError({
        res,
        error: new Error('user not found'),
        reqType: 'GET',
        controllerName: 'getEventById',
        action: 'check if event exists in DB'
      });
    }

    return res.status(200).json(event);
  } catch (error) {
    handleControllerError({
      res,
      error,
      reqType: 'GET',
      controllerName: 'getEventById',
      action: 'fetch event with _id from DB'
    });
  }
};

const getEventsByCreator = async (req, res) => {
  try {
  } catch (error) {}
};

const createEvent = async (req, res) => {
  try {
  } catch (error) {}
};

const updateEvent = async (req, res) => {
  try {
  } catch (error) {}
};

const deleteEvent = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  getEvents,
  getEventById,
  getEventsByCreator,
  createEvent,
  updateEvent,
  deleteEvent
};
