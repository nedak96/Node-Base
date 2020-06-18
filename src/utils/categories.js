const db = require('../db/elastic');

const getCategories = () => db.read('categories');

const createCategory = (category) => db.create('categories', category);

const deleteAllCategories = () => db.drop('categories');

const getChildrenCategories = async (category) => {
  if (!category) {
    return undefined;
  }
  const childrenCategories = [];
  const categories = await db.read('categories');
  const buildChildrenCategories = (id) => {
    childrenCategories.push(id);
    categories
      .filter((cat) => cat.parentId === id)
      .forEach((cat) => buildChildrenCategories(cat._id));
  };
  buildChildrenCategories(category);
  return childrenCategories;
};

module.exports = {
  getCategories,
  createCategory,
  deleteAllCategories,
  getChildrenCategories,
};
