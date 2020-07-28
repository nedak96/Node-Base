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
 * Route to update a user's information
 * @name update-user
 * @function
 * @memberof module:api/v1~users
 * @endpoint /api/v1/users/:userId
 * @method PUT
 */
userRouter.put('/:userId', controller.updateUser);

module.exports = userRouter;
