const db = require('../db/mongo');

const getItems = (skip, limit) => (
  db.read('items', {}, { skip, limit })
);

const createItem = (item) => db.create('items', item);

const deleteAllItems = () => db.drop('items');

module.exports = {
  getItems,
  createItem,
  deleteAllItems,
};
