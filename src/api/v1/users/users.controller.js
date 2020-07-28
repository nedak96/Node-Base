/**
 * @module /api/v1/users
 * @fileoverview
 * @access @public
 * @since
 */

const usersService = require('../../../utils/users');
const {
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  OK,
} = require('../../../constants/responseCodes');

const TWO_MIN_TIMEOUT = 120000;

/**
 * Authenticate a user's credentials
 * @function authenticateUser
 * @param {Object} req The request object from Express
 * @param {Object} res The Response object from Express
 */
const updateUser = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);

  const { userId } = req.params;
  const { picture, given_name, family_name } = req.body;

  if (!req.user || req.user.sub !== userId) {
    return res.sendStatus(UNAUTHORIZED);
  }

  try {
    await usersService.updateUser(userId, given_name, family_name, picture);
    return res.sendStatus(OK);
  } catch (error) {
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).send(error.message);
  }
};

module.exports = {
  updateUser,
};
