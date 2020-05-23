const bcrypt = require('bcrypt');
const db = require('../db/mongo');
const UnauthorizedError = require('../errors/Unauthorized');
const ConflictError = require('../errors/ConflictError');

const saltRounds = 10;

const users = {};

const authenticateUser = async (email, password) => {
  const user = await db.read('users', email);
  if (!user) {
    throw new UnauthorizedError();
  }
  return bcrypt.compare(password, user.password)
    .then((res) => {
      if (!res) {
        throw new UnauthorizedError();
      }
      return { ...user, password: undefined };
    });
};

const createUser = (email, password, name) => bcrypt.hash(password, saltRounds)
  .then((res) => db.create('users', {
    _id: email,
    email,
    password: res,
    name,
  })
    .then(() => ({ ok: true }))
    .catch((error) => {
      if (error.statusCode === 409) {
        throw new ConflictError();
      }
      throw new Error(error);
    }));

const getUser = async (email) => {
  const user = await db.read('users', email);
  if (!users) {
    throw UnauthorizedError();
  }
  return { ...user, password: undefined };
};

module.exports = {
  authenticateUser,
  createUser,
  getUser,
};
