const Event = require('../models/event');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
  } catch (error) {}
};

const getEventById = async (req, res) => {
  try {
  } catch (error) {}
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
