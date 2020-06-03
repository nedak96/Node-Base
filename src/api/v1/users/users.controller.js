/**
 * @module /api/v1/users
 * @fileoverview
 * @access @public
 * @since
 */

const usersService = require('../../../utils/users');
const { generateToken } = require('../../../utils/tokens');
const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  UNAUTHORIZED,
  OK,
  CREATED,
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
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(BAD_REQUEST).send('Bad Request');
  }
  try {
    const response = {};
    response.user = await usersService.authenticateUser(email, password);
    response.token = generateToken(response.user);
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
    const response = await usersService.createUser(req.body);
    return res.status(CREATED).send(response);
  } catch (error) {
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).send(error);
  }
};

/**
 * Validate token
 * @function validateToken
 * @param {Object} req The request object from Express
 * @param {Object} res The Response object from Express
 */
const validateToken = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  if (!req.user) {
    return res.sendStatus(UNAUTHORIZED);
  }
  return res.status(OK).send({ user: req.user });
};

module.exports = {
  authenticateUser,
  createUser,
  validateToken,
};
