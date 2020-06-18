/**
 * @module index.js
 * @fileoverview Export routes from the `routes/` directory.
 */

const users = require('./users');
const items = require('./items');
const categories = require('./categories');

const routes = (server) => {
  server.use('/api/v1/users', users);
  server.use('/api/v1/items', items);
  server.use('/api/v1/categories', categories);
};

module.exports = routes;
