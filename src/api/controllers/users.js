const { generateToken } = require('../../config/jwt');
const deleteCloudinaryImg = require('../../utils/cldImageDeleter');
const handleControllerError = require('../../utils/errorHandlers');
const User = require('../models/user');
const bcrypt = require('bcrypt');

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
    const { userName, emailAddress, password } = req.body;

    const newUser = new User({
      userName,
      emailAddress,
      password,
      role: 'user',
      img: req.file?.path
    });

    const duplicateUser = await User.findOne({
      $or: [{ userName }, { emailAddress }]
    });

    if (duplicateUser) {
      if (req.file?.path) deleteCloudinaryImg(req.file.path);

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
      message: 'user registered successfully',
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
    const { userName, emailAddress, password } = req.body;

    const user = await User.findOne({ $or: [{ userName }, { emailAddress }] });

    if (!user) {
      return handleControllerError({
        res,
        error: new Error("user doesn't exist"),
        reqType: 'POST',
        controllerName: 'loginUser',
        action: 'check if user exists in DB'
      });
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user._id);
      return res
        .status(200)
        .json({ message: 'user logged in successfully', user, token });
    } else {
      return handleControllerError({
        res,
        error: new Error('the password is incorrect'),
        reqType: 'POST',
        controllerName: 'loginUser',
        action: 'check password'
      });
    }
  } catch (error) {
    handleControllerError({
      res,
      error,
      reqType: 'POST',
      controllerName: 'loginUser',
      action: 'login user'
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, emailAddress, password } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return handleControllerError({
        res,
        error: new Error('user does not exist in DB'),
        reqType: 'PUT',
        controllerName: 'updateUser',
        action: 'check if user exists in DB'
      });
    }

    const duplicateUser = await User.findOne({
      $or: [{ userName }, { emailAddress }],
      _id: { $ne: id }
    });

    if (duplicateUser) {
      if (req.file?.path) deleteCloudinaryImg(req.file.path);

      return handleControllerError({
        res,
        error: new Error('Update failed, username or email already in use'),
        reqType: 'PUT',
        controllerName: 'updateUser',
        action: 'check for duplicates before update'
      });
    }

    if (req.user.role !== 'admin') {
      delete req.body.role;
    }

    if (req.file) {
      if (user.img) {
        deleteCloudinaryImg(user.img);
      }
      req.body.img = req.file.path;
    }

    if (password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    return res
      .status(200)
      .json({ message: 'user updated successfully', user: updatedUser });
  } catch (error) {
    handleControllerError({
      res,
      error,
      reqType: 'PUT',
      controllerName: 'updateUser',
      action: 'update existing user'
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return handleControllerError({
        res,
        error: new Error('user does not exist in DB'),
        reqType: 'DELETE',
        controllerName: 'deleteUser',
        action: 'check if user exists in DB'
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (deletedUser.img) {
      deleteCloudinaryImg(deletedUser.img);
    }

    return res.status(200).json({
      message: 'user deleted successfully',
      user: deletedUser
    });
  } catch (error) {
    handleControllerError({
      res,
      error,
      reqType: 'DELETE',
      controllerName: 'deleteUser',
      action: 'delete user in DB'
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  updateUser,
  deleteUser
};
