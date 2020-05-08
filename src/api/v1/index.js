/**
 * @module index.js
 * @fileoverview Export routes from the `routes/` directory.
 */

const users = require('./users');

const routes = (server) => {
  server.use('/api/v1/users', users);
};

module.exports = routes;
