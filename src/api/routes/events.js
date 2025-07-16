const { isAuth } = require('../../middlewares/auth');
const upload = require('../../middlewares/cld');
const {
  getEvents,
  getEventById,
  getEventsByCreator,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/events');

const eventsRouter = require('express').Router();

eventsRouter.get('/', getEvents);
eventsRouter.get('/:id', getEventById);
eventsRouter.get('/creator/:creatorId', [isAuth], getEventsByCreator);

eventsRouter.post('/', [isAuth, upload.single('img')], createEvent);

eventsRouter.put('/:id', [isAuth, upload.single('img')], updateEvent);

eventsRouter.delete('/:id', [isAuth], deleteEvent);

module.exports = eventsRouter;
