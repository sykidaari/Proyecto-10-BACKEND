const eventsRouter = require('./events');
const usersRouter = require('./users');

const mainRouter = require('express').Router();

mainRouter.use('/users', usersRouter);
mainRouter.use('/events', eventsRouter);

module.exports = mainRouter;
