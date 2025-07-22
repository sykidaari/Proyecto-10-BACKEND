const deleteCloudinaryImg = require('../../utils/cldImageDeleter');
const handleControllerError = require('../../utils/errorHandlers');
const Event = require('../models/event');

const getEvents = async (req, res) => {
  try {
    const { category, order = 'desc' } = req.query;

    const filter = category ? { category } : {};

    const sortOrder = order === 'asc' ? 1 : -1;

    const events = await Event.find(filter)
      .sort({
        date: sortOrder
      })
      .populate(['creator', 'attendants']);

    return res.status(200).json(events);
  } catch (error) {
    handleControllerError({
      res,
      error,
      method: 'GET',
      controllerName: 'getEvents',
      action: 'fetch events from DB'
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate(['creator', 'attendants']);

    if (!event) {
      return handleControllerError({
        res,
        error: new Error('event not found'),
        method: 'GET',
        controllerName: 'getEventById',
        action: 'check if event exists in DB'
      });
    }

    return res.status(200).json(event);
  } catch (error) {
    handleControllerError({
      res,
      error,
      method: 'GET',
      controllerName: 'getEventById',
      action: 'fetch event with _id from DB'
    });
  }
};

const getEventsByCreator = async (req, res) => {
  try {
    const { creatorId } = req.params;

    const events = await Event.find({ creator: creatorId })
      .sort({
        date: -1
      })
      .populate(['creator', 'attendants']);

    return res.status(200).json(events);
  } catch (error) {
    handleControllerError({
      res,
      error,
      method: 'GET',
      controllerName: 'getEventsByCreator',
      action: 'fetch events with creator from DB'
    });
  }
};

const createEvent = async (req, res) => {
  try {
    const newEvent = new Event({ ...req.body, img: req.file?.path });

    const savedEvent = await newEvent.save();

    const populatedEvent = await savedEvent.populate(['creator', 'attendants']);

    return res.status(201).json({
      message: 'event created successfully',
      event: populatedEvent
    });
  } catch (error) {
    handleControllerError({
      res,
      error,
      method: 'POST',
      controllerName: 'createEvent',
      action: 'upload new event to DB'
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return handleControllerError({
        res,
        error: new Error('event does not exist in DB'),
        method: 'PUT',
        controllerName: 'updateEvent',
        action: 'check if event exists in DB'
      });
    }

    if (req.file) {
      if (event.img) {
        deleteCloudinaryImg(event.img);
      }
      req.body.img = req.file.path;
    }

    const updateFields = { ...req.body };

    let attendants = req.body.attendants;
    if (attendants && !Array.isArray(attendants)) {
      attendants = [attendants];
    }

    if (Array.isArray(attendants)) {
      updateFields.$addToSet = {
        attendants: { $each: attendants }
      };
      delete updateFields.attendants;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true
    }).populate(['creator', 'attendants']);

    return res
      .status(200)
      .json({ message: 'event updated successfully', event: updatedEvent });
  } catch (error) {
    handleControllerError({
      res,
      error,
      method: 'PUT',
      controllerName: 'updateEvent',
      action: 'update existing event'
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return handleControllerError({
        res,
        error: new Error('event does not exist in DB'),
        method: 'DELETE',
        controllerName: 'deleteEvent',
        action: 'check if event exists in DB'
      });
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (deletedEvent.img) {
      deleteCloudinaryImg(deletedEvent.img);
    }

    return res.status(200).json({
      message: 'event deleted successfully',
      event: deletedEvent
    });
  } catch (error) {
    handleControllerError({
      res,
      error,
      method: 'DELETE',
      controllerName: 'deleteEvent',
      action: 'delete event in DB'
    });
  }
};

module.exports = {
  getEvents,
  getEventById,
  getEventsByCreator,
  createEvent,
  updateEvent,
  deleteEvent
};
