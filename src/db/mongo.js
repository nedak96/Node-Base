const { MongoClient } = require('mongodb');
const ConflictError = require('../errors/ConflictError');

let connection;
let db;

const createConnection = () => (
  MongoClient.connect('mongodb://127.0.0.1:27017', { useUnifiedTopology: true })
    .then((database) => {
      db = database.db('mydb');
      connection = database;
    }).catch((error) => {
      throw new Error(error);
    })
);

const closeConnection = () => (
  connection.close()
);

const readOne = (collectionName, id, projection) => (
  db.collection(collectionName).findOne({ _id: id }, { projection })
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    })
);

const readMany = (collectionName, query, projection, options) => (
  db.collection(collectionName).find(query, { projection })
    .sort({ [options.sort || '_id']: options.desc ? -1 : 1 })
    .limit(options.limit || 1000)
    .skip(options.skip || 0)
    .toArray()
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    })
);

const read = (collectionName, toRead = {}, options = {}) => {
  const projection = {};
  if (Array.isArray(options.columns)) {
    projection._id = false;
    options.columns.forEach((column) => {
      projection[column] = true;
    });
  }

  if (typeof toRead === 'string') {
    return readOne(collectionName, toRead, projection);
  }
  return readMany(collectionName, toRead, projection, options);
};

const createOne = (collectionName, obj) => (
  db.collection(collectionName).insertOne(obj)
    .then((res) => res)
    .catch((error) => {
      // Catch duplication error
      if (error.name === 'MongoError' && error.code === 11000) {
        throw new ConflictError();
      }
      throw new Error(error);
    })
);

const createMany = (collectionName, objs) => (
  db.collection(collectionName).insertMany(objs)
    .then((res) => res)
    .catch((error) => {
      if (error.name === 'BulkWriteError' && error.code === 11000) {
        throw new ConflictError('Conlict Error', { nSuccess: error.result.nInserted });
      }
      throw new Error(error);
    })
);

const create = (collectionName, toCreate) => {
  if (Array.isArray(toCreate)) {
    return createMany(collectionName, toCreate);
  }
  return createOne(collectionName, toCreate);
};

const delOne = (collectionName, id) => (
  db.collection(collectionName).deleteOne({ _id: id })
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    })
);

const delMany = (collectionName, query) => (
  db.collection(collectionName).deleteMany(query)
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    })
);

const del = (collectionName, toDelete) => {
  if (typeof toDelete === 'string') {
    return delOne(collectionName, toDelete);
  }
  return delMany(collectionName, toDelete);
};

const updateOne = (collectionName, id, newValues) => (
  db.collection(collectionName).updateOne({ _id: id }, { $set: newValues })
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    })
);

const updateMany = (collectionName, query, newValues) => (
  db.collection(collectionName).updateMany(query, { $set: newValues })
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    })
);

const update = (collectionName, toUpdate, newValues) => {
  if (typeof toUpdate === 'string') {
    return updateOne(collectionName, toUpdate, newValues);
  }
  return updateMany(collectionName, toUpdate, newValues);
};

const drop = (collectionName) => (
  db.collection(collectionName).drop()
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    })
);

module.exports = {
  createConnection,
  create,
  read,
  update,
  del,
  drop,
  closeConnection,
};
