const db = require('../db/elastic');

const getItems = (skip, limit, search) => (
  search
    ? db.search('items', search, { skip, limit, fields: ['title', 'description'] })
    : db.read('items', {}, { skip, limit })
);

const createItem = (item) => db.create('items', item);

const deleteAllItems = () => db.drop('items');

module.exports = {
  getItems,
  createItem,
  deleteAllItems,
};
