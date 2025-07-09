const { generateToken } = require('../../config/jwt');
const handleControllerError = require('../../utils/errorHandlers');
const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    handleControllerError({
      res,
      error,
      reqType: 'GET',
      controllerName: 'getUsers',
      action: 'fetch users from DB'
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return handleControllerError({
        res,
        error: new Error('user not found'),
        reqType: 'GET',
        controllerName: 'getUserById',
        action: 'check if user exists in DB'
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    handleControllerError({
      res,
      error,
      reqType: 'GET',
      controllerName: 'getUserById',
      action: 'fetch user with _id from DB'
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email_address, password } = req.body;

    const newUser = new User({
      username,
      email_address,
      password,
      role: 'user',
      img: req.file?.path
    });

    const duplicateUser = await User.findOne({
      $or: [{ username }, { email_address }]
    });

    if (duplicateUser) {
      return handleControllerError({
        res,
        error: new Error('Register failed, username or email already exists'),
        reqType: 'POST',
        controllerName: 'registerUser',
        action: 'check if user exists in DB'
      });
    }

    const userSaved = await newUser.save();
    const token = generateToken(userSaved._id);

    return res.status(201).json({
      message: 'user registered succesfully',
      user: userSaved,
      token
    });
  } catch (error) {
    handleControllerError({
      res,
      error,
      reqType: 'POST',
      controllerName: 'registerUser',
      action: 'register new user'
    });
  }
};

const loginUser = async (req, res) => {
  try {
  } catch (error) {}
};

const updateUser = async (req, res) => {
  try {
  } catch (error) {}
};

const deleteUser = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  updateUser,
  deleteUser
};
