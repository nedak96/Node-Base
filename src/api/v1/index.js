/**
 * @module index.js
 * @fileoverview Export routes from the `routes/` directory.
 */

const users = require('./users');
const items = require('./items');

const routes = (server) => {
  server.use('/api/v1/users', users);
  server.use('/api/v1/items', items);
};

module.exports = routes;
