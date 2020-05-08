/**
 * @module index.js
 * @fileoverview API module for user routes.
 * @imports YARN:Express
 * @imports api/v1/users/users.controller
 * @exports userRouter
 */

const express = require('express');
const controller = require('./users.controller.js');

/**
 * Express module's router object.
 * @type {Object}
 * @namespace apiRouter
 * @const
 */
const userRouter = express.Router();

/**
 * Route for authenticating a user
 * @name authenticate-user
 * @function
 * @memberof module:api/v1~users
 * @endpoint /api/v1/users/authenticate-user
 * @method POST
 */
userRouter.post('/authenticate-user', controller.authenticateUser);

/**
 * Route to create a new user
 * @name create-user
 * @function
 * @memberof module:api/v1~users
 * @endpoint /api/v1/users/create-user
 * @method POST
 */
userRouter.post('/create-user', controller.createUser);

/**
 * Route to log out user
 * @name logout
 * @function
 * @memberof module:api/v1~users
 * @endpoint /api/v1/users/logout
 * @method GET
 */
userRouter.get('/logout', controller.logout);

/**
 * Route to check session
 * @name logout
 * @function
 * @memberof module:api/v1~users
 * @endpoint /api/v1/users/check-session
 * @method GET
 */
userRouter.get('/check-session', controller.checkSession);

module.exports = userRouter;
