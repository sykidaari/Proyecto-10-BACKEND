const { isAdmin, isAuth } = require('../../middlewares/auth');
const upload = require('../../middlewares/cld');
const {
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

const usersRouter = require('express').Router();

usersRouter.get('/', [isAdmin], getUsers);
usersRouter.get('/:id', [isAuth], getUserById);

usersRouter.post('/register', [upload.single('img')], registerUser);
usersRouter.post('/login', loginUser);

module.exports = usersRouter;
