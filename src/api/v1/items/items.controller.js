/**
 * @module /api/v1/users
 * @fileoverview
 * @access @public
 * @since
 */

const itemsUtils = require('../../../utils/items');
const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK,
  CREATED,
} = require('../../../constants/responseCodes');

const TWO_MIN_TIMEOUT = 120000;

/**
 * Create a new user
 * @function createUser
 * @param {Object} req The request object from Express
 * @param {Object} res The Response object from Express
 */
const createItem = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  const {
    title,
    author,
    description,
    image,
  } = req.body;
  if (!title || !author || !description || !image) {
    return res.status(BAD_REQUEST).send('Bad Request');
  }
  try {
    await itemsUtils.createItem(req.body);
    return res.sendStatus(CREATED);
  } catch (error) {
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).send(error);
  }
};

const getItems = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  const { skip, limit, search } = req.query;
  try {
    const data = await itemsUtils.getItems(
      skip ? parseInt(skip, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      search,
    );
    return res.status(OK).send({ docs: data });
  } catch (error) {
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).send(error);
  }
};

const deleteAllItems = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  try {
    await itemsUtils.deleteAllItems();
    return res.sendStatus(200);
  } catch (error) {
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).send(error);
  }
};

module.exports = {
  getItems,
  createItem,
  deleteAllItems,
};
