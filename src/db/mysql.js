const mysql = require('mysql');
const Promise = require('bluebird');
const ConflictError = require('../errors/ConflictError');

let db;

const query = (queryString, values) => (
  new Promise((resolve, reject) => {
    db.query(queryString, values, (error, res) => {
      if (error) {
        return reject(error);
      }
      return resolve(res);
    });
  })
);

const createConnection = () => {
  db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'password',
  });
  query('CREATE DATABASE IF NOT EXISTS mydb');
  db.end();
  db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'mydb',
  });
};

const createTable = (tableName, columns) => (
  query(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`)
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    })
);

const closeConnection = () => (
  db.end()
);

const readOne = (tableName, id, columns) => (
  query(`SELECT ${columns} FROM ${tableName} WHERE _id='${id}'`)
    .then((res) => (res.length ? res[0] : null))
    .catch((error) => {
      throw new Error(error);
    })
);

const readMany = (tableName, queryObj, columns, options) => {
  const sort = options.sort ? ` ORDER BY ${options.sort} ${options.desc ? 'DESC' : 'ASC'}` : '';
  const limit = options.limit ? ` LIMIT ${options.limit}` : '';
  const skip = options.skip ? `${limit ? '' : ' LIMIT 10000000'} OFFSET ${options.skip}` : '';
  const where = queryObj && Object.keys(queryObj).length ? ` WHERE ${Object.keys(queryObj).map((key) => `${key}='${queryObj[key]}'`).join(' AND ')}` : '';
  return query(`SELECT ${columns} FROM ${tableName}${where}${sort}${limit}${skip}`)
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    });
};

const read = (tableName, toRead, options = {}) => {
  if (typeof toRead === 'string') {
    return readOne(tableName, toRead, options.columns ? options.columns.toString() : '*', options);
  }
  return readMany(tableName, toRead, options.columns ? options.columns.toString() : '*', options);
};

const createOne = (tableName, obj) => (
  query(`INSERT INTO ${tableName} (${Object.keys(obj).toString()}) VALUES ?`, [[Object.values(obj)]])
    .then((res) => res)
    .catch((error) => {
      // Catch duplication error
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictError();
      }
      throw new Error(error);
    })
);

const createMany = (tableName, objs) => {
  const keys = Object.keys(objs[0]);
  return db.execute(`INSERT INTO ${tableName} (${keys.toString()}) VALUES ?`, [objs.map((obj) => keys.map((key) => obj[key]))])
    .then((res) => res)
    .catch((error) => {
      // Catch duplication error
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictError('Conflict Error', { nSuccess: 0 });
      }
      throw new Error(error);
    });
};

const create = (tableName, toCreate) => {
  if (Array.isArray(toCreate)) {
    return createMany(tableName, toCreate);
  }
  return createOne(tableName, toCreate);
};

const delOne = (tableName, id) => (
  query(`DELETE FROM ${tableName} WHERE _id='${id}'`)
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    })
);

const delMany = (tableName, queryObj) => {
  const where = ` WHERE ${Object.keys(queryObj).map((key) => `${key}='${queryObj[key]}'`).join(' AND ')}`;
  return query(`DELETE FROM ${tableName} ${where}`)
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    });
};

const del = (tableName, toDelete) => {
  if (typeof toDelete === 'string') {
    return delOne(tableName, toDelete);
  }
  return delMany(tableName, toDelete);
};

const updateOne = (tableName, id, newValues) => (
  query(`UPDATE ${tableName} SET ${newValues} WHERE _id='${id}'`)
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    })
);

const updateMany = (tableName, queryObj, newValues) => {
  const where = ` WHERE ${Object.keys(queryObj).map((key) => `${key}='${queryObj[key]}'`).join(' AND ')}`;
  return query(`UPDATE ${tableName} SET ${newValues} ${where}`)
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    });
};

const update = (tableName, toUpdate, newValues) => {
  if (typeof toUpdate === 'string') {
    return updateOne(tableName, toUpdate, Object.keys(newValues).map((key) => `${key}='${newValues[key]}'`).toString());
  }
  return updateMany(tableName, toUpdate, Object.keys(newValues).map((key) => `${key}='${newValues[key]}'`).toString());
};

const drop = (tableName) => (
  query(`DROP TABLE ${tableName}`)
    .then(() => true)
    .catch(() => false)
);

module.exports = {
  createConnection,
  create,
  createTable,
  read,
  update,
  del,
  drop,
  closeConnection,
};
