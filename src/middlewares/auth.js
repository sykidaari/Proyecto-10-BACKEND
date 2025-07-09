const User = require('../api/models/user');
const { verifyToken } = require('../config/jwt');

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const parsedToken = token.replace('Bearer ', '');

    const { id } = verifyToken(parsedToken);

    const user = await User.findById(id);

    user.password = null;
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json('You are unauthorized');
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const parsedToken = token.replace('Bearer ', '');

    const { id } = verifyToken(parsedToken);

    const user = await User.findById(id);

    user.role === 'admin'
      ? ((user.password = null), (req.user = user), next())
      : res.status(400).json('This action is exclusive to administrators');
  } catch (error) {
    return res.status(400).json('You are unauthorized');
  }
};

module.exports = { isAuth, isAdmin };
