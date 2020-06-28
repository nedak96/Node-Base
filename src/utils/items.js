const db = require('../db/elastic');
const categoryUtils = require('./categories');

const getItems = async (skip, limit, search, category) => {
  const categories = await categoryUtils.getChildrenCategories(category);
  return search
    ? db.search('items', search, {
      skip,
      limit,
      fields: ['title', 'description'],
      categories,
    })
    : db.read('items', {}, {
      skip,
      limit,
      categories,
    });
};

const getItem = (id) => db.read('items', id);

const createItem = (item) => db.create('items', item);

const deleteAllItems = () => db.drop('items');

module.exports = {
  getItems,
  getItem,
  createItem,
  deleteAllItems,
};
