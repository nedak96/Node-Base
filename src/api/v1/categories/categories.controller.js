/**
 * @module /api/v1/categories
 * @fileoverview
 * @access @public
 * @since
 */

const categoryUtils = require('../../../utils/categories');
const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK,
  CREATED,
} = require('../../../constants/responseCodes');

const TWO_MIN_TIMEOUT = 120000;

/**
 * Create a new category
 * @function createCategory
 * @param {Object} req The request object from Express
 * @param {Object} res The Response object from Express
 */
const createCategory = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  const {
    name,
    parentId,
  } = req.body;
  if (!name || parentId === undefined) {
    return res.status(BAD_REQUEST).send('Bad Request');
  }
  try {
    const dbRes = await categoryUtils.createCategory({ name, parentId });
    return res.status(CREATED).send(dbRes);
  } catch (error) {
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).send(error);
  }
};

/**
 * Get categories
 * @function getCategories
 * @param {Object} req The request object from Express
 * @param {Object} res The Response object from Express
 */
const getCategories = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  try {
    const data = await categoryUtils.getCategories();
    return res.status(OK).send({ docs: data });
  } catch (error) {
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).send(error);
  }
};

/**
 * Delete all categories from DB
 * @function deleteAllCategories
 * @param {Object} req The request object from Express
 * @param {Object} res The Response object from Express
 */
const deleteAllCategories = async (req, res) => {
  req.setTimeout(TWO_MIN_TIMEOUT);
  try {
    await categoryUtils.deleteAllCategories();
    return res.sendStatus(OK);
  } catch (error) {
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).send(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteAllCategories,
};
