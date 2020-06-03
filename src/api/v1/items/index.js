/**
 * @module index.js
 * @fileoverview API module for user routes.
 * @imports YARN:Express
 * @imports api/v1/items/items.controller
 * @exports itemsRouter
 */

const express = require('express');
const controller = require('./items.controller.js');

/**
 * Express module's router object.
 * @type {Object}
 * @namespace apiRouter
 * @const
 */
const itemsRouter = express.Router();

/**
 * Route for getting items
 * @name get-items
 * @function
 * @memberof module:api/v1~items
 * @endpoint /api/v1/users/
 * @method GET
 */
itemsRouter.get('/', controller.getItems);

/**
 * Route to create a new item
 * @name create-item
 * @function
 * @memberof module:api/v1~items
 * @endpoint /api/v1/items
 * @method POST
 */
itemsRouter.post('/', controller.createItem);

/**
 * Route to delete all items
 * @name delete-all-items
 * @function
 * @memberof module:api/v1~items
 * @endpoint /api/v1/items
 * @method DEL
 */

itemsRouter.delete('/', controller.deleteAllItems);

module.exports = itemsRouter;
