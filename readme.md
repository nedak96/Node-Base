# Node Base

*Base code for a Node.JS Server*

Features:
* Express Setup
* Express Sessions
* Basic Login Endpoints
* Database Abstraction Layer
  * MongoDB base layer
  * Elastic base layer
  * MySQL base layer
  * PostgreSQL base layer
* Mocha tests for database layers

To Run:
* Clone repository
* Start Redis (or other desired session storage)
* Start database (Set up for MongoDB)
* Run `yarn` to install dependencies
* Run `yarn start` to start development server

Things to Note:
* Database layers are not fully built
* Further security must be built out
* If running the MySQL DB layer, I ran `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password’;` in the client