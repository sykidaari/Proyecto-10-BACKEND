const usersRouter = require('./users');

const mainRouter = require('express').Router();

mainRouter.use('/users', usersRouter);

module.exports = mainRouter;
