/**
 * @module index.js
 * @fileoverview API module for category routes.
 * @imports YARN:Express
 * @imports api/v1/categories/categories.controller
 * @exports categoriesRouter
 */

const express = require('express');
const controller = require('./categories.controller.js');

/**
 * Express module's router object.
 * @type {Object}
 * @namespace apiRouter
 * @const
 */
const categoriesRouter = express.Router();

/**
 * Route for getting categories
 * @name get-categories
 * @function
 * @memberof module:api/v1~categories
 * @endpoint /api/v1/categories/
 * @method GET
 */
categoriesRouter.get('/', controller.getCategories);

/**
 * Route to create a new category
 * @name create-category
 * @function
 * @memberof module:api/v1~categories
 * @endpoint /api/v1/categories
 * @method POST
 */
categoriesRouter.post('/', controller.createCategory);

/**
 * Route to delete all categories
 * @name delete-all-categories
 * @function
 * @memberof module:api/v1~categories
 * @endpoint /api/v1/categories
 * @method DEL
 */

categoriesRouter.delete('/', controller.deleteAllCategories);

module.exports = categoriesRouter;
