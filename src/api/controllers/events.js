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
      .populate('user');

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

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return handleControllerError({
        res,
        error: new Error('event not found'),
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
    const { creatorId } = req.params;

    const events = await Event.find({ createdBy: creatorId })
      .sort({
        date: -1
      })
      .populate('user');

    return res.status(200).json(events);
  } catch (error) {
    handleControllerError({
      res,
      error,
      reqType: 'GET',
      controllerName: 'getEventsByCreator',
      action: 'fetch events with creator from DB'
    });
  }
};

const createEvent = async (req, res) => {
  try {
    const newEvent = new Event({ ...req.body, img: req.file?.path });

    const savedEvent = await newEvent.save();

    const populatedEvent = await savedEvent.populate('user');

    return res.status(201).json({
      message: 'event created successfully',
      event: populatedEvent
    });
  } catch (error) {
    handleControllerError({
      res,
      error,
      reqType: 'POST',
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
        reqType: 'PUT',
        controllerName: 'updateEvent',
        action: 'check if event exists in DB'
      });
    }

    if (req.file) {
      deleteCloudinaryImg(event.img);
      req.body.img = req.file.path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    return res
      .status(200)
      .json({ message: 'event updated successfully', event: updatedEvent });
  } catch (error) {
    handleControllerError({
      res,
      error,
      reqType: 'PUT',
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
        reqType: 'DELETE',
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
      reqType: 'DELETE',
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
