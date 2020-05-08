/**
 * @module /api/v1/users
 * @fileoverview
 * @access @public
 * @since
 */

const usersService = require('../../../services/v1/users.js');
const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK,
} = require('../../../constants/responseCodes');

const TWO_MIN_TIMEOUT = 120000;

/**
 * Authenticate a user's credentials
 * @function authenticateUser
 * @param {Object} req The request object from Express
 * @param {Object} res The Response object from Express
 */
const authenticateUser = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  const { email, password, rememberSession } = req.body;
  if (!email || !password) {
    return res.status(BAD_REQUEST).send('Bad Request');
  }
  try {
    const response = await usersService.authenticateUser(email, password);
    req.session.email = email;
    if (rememberSession) {
      req.session.cookie.expires = 7 * 24 * 60 * 60 * 1000; // One Week
    } else {
      req.session.cookie.expires = false;
    }
    return res.status(OK).send(response);
  } catch (error) {
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).send(error);
  }
};

/**
 * Create a new user
 * @function createUser
 * @param {Object} req The request object from Express
 * @param {Object} res The Response object from Express
 */
const createUser = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(BAD_REQUEST).send('Bad Request');
  }
  try {
    const response = await usersService.createUser(email, password, req.body.firstName);
    return res.status(OK).send(response);
  } catch (error) {
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).send(error);
  }
};

/**
 * Logout
 * @function logout
 * @param {Object} req The request object from Express
 * @param {Object} res The Response object from Express
 */
const logout = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  try {
    const response = req.session.destroy();
    return res.status(OK).send(response);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send(error);
  }
};

/**
 * Check session
 * @function checkSession
 * @param {Object} req The request object from Express
 * @param {Object} res The Response object from Express
 */
const checkSession = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  if (!req.session.email) {
    return res.status(OK).send({ sessionValid: false });
  }
  try {
    const response = await usersService.getUser(req.session.email);
    return res.status(OK).send({ sessionValid: true, ...response });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send(error);
  }
};

module.exports = {
  authenticateUser,
  createUser,
  logout,
  checkSession,
};
