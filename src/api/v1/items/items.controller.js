/**
 * @module /api/v1/items
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
  NOT_FOUND,
} = require('../../../constants/responseCodes');

const TWO_MIN_TIMEOUT = 120000;

/**
 * Create a new item
 * @function createItem
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

/**
 * Get items
 * @function getItems
 * @param {Object} req The request object from Express
 * @param {Object} res The Response object from Express
 */
const getItems = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  const {
    skip,
    limit,
    search,
    category,
  } = req.query;
  try {
    const data = await itemsUtils.getItems(
      skip ? parseInt(skip, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      search,
      category,
    );
    return res.status(OK).send({ docs: data });
  } catch (error) {
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).send(error);
  }
};

/**
 * Get an item
 * @function getItem
 * @param {Object} req The request object from Express
 * @param {Object} res The Response object from Express
 */
const getItem = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  const { itemId } = req.params;
  try {
    const item = await itemsUtils.getItem(itemId);
    if (item === null) {
      return res.sendStatus(NOT_FOUND);
    }
    return res.status(OK).send(item);
  } catch (error) {
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).send(error);
  }
};

/**
 * Delete all items from DB
 * @function deleteAllItems
 * @param {Object} req The request object from Express
 * @param {Object} res The Response object from Express
 */
const deleteAllItems = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  try {
    await itemsUtils.deleteAllItems();
    return res.sendStatus(OK);
  } catch (error) {
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).send(error);
  }
};

module.exports = {
  getItems,
  createItem,
  deleteAllItems,
  getItem,
};
