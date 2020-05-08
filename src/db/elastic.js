const { Client } = require('@elastic/elasticsearch');
const ConflictError = require('../errors/ConflictError');

let db;

const createConnection = async () => {
  db = await new Client({ node: 'http://localhost:9200' });
  return db.ping()
    .then(() => true)
    .catch((error) => {
      throw new Error(error);
    });
};

const readOne = (index, id, columns) => (
  db.get({
    id,
    index,
    _source_includes: columns,
  })
    .then(({ body }) => ({ _id: columns && !columns.includes('_id') ? undefined : body._id, ...body._source }))
    .catch((error) => {
      if (error.statusCode === 404) {
        return null;
      }
      throw new Error(error);
    })
);

const readMany = (index, query, options) => (
  db.search({
    index,
    from: options.skip,
    size: options.limit,
    body: {
      query: {
        bool: {
          filter: Object.keys(query).map((key) => ({ match: { [key]: query[key] } })),
        },
      },
    },
    sort: options.sort ? [`${options.sort}.keyword:${options.desc ? 'desc' : 'asc'}`] : undefined,
    filter_path: ['hits.hits._id', 'hits.hits._source'],
    _source_includes: options.columns,
  })
    .then((res) => {
      if (!res.body.hits) {
        return [];
      }
      return res.body.hits.hits.map((obj) => ({
        _id: options.columns && !options.columns.includes('_id') ? undefined : obj._id,
        ...obj._source,
      }));
    })
    .catch((error) => {
      throw new Error(error);
    })
);

const read = (index, toRead = {}, options = {}) => {
  if (typeof toRead === 'string') {
    return readOne(index, toRead, options.columns);
  }
  return readMany(index, toRead, options);
};

const createOne = (index, obj) => (
  db.create({
    id: obj._id,
    index,
    body: { ...obj, _id: undefined },
  })
    .then((res) => res)
    .catch((error) => {
      // Catch duplication error
      if (error.statusCode === 409) {
        throw new ConflictError();
      }
      throw new Error(error);
    })
);

const createMany = (index, objs) => (
  db.bulk({
    index,
    refresh: true,
    body: objs.flatMap((obj) => [{ create: { _id: obj._id } }, { ...obj, _id: undefined }]),
  })
    .then((res) => {
      if (res.body.errors) {
        let nSuccess = 0;
        res.body.items.forEach((obj) => {
          if (obj.create.status === 201) {
            nSuccess += 1;
          }
        });
        throw new ConflictError('Conflict Error', { nSuccess });
      }
      return res;
    }).catch((error) => {
      if (error.statusCode === 409) {
        throw error;
      }
      throw new Error(error);
    })
);

const create = (index, toCreate) => {
  if (Array.isArray(toCreate)) {
    return createMany(index, toCreate);
  }
  return createOne(index, toCreate);
};

const delOne = (index, id) => (
  db.delete({
    index,
    id,
    refresh: true,
  })
    .then((res) => res)
    .catch((error) => {
      if (error.statusCode === 404) {
        return { nSuccess: 0 };
      }
      throw new Error(error);
    })
);

const delMany = (index, query) => (
  db.deleteByQuery({
    index,
    refresh: true,
    body: {
      query: {
        bool: {
          filter: Object.keys(query).map((key) => ({ match: { [key]: query[key] } })),
        },
      },
    },
  })
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    })
);

const del = (index, toDelete) => {
  if (typeof toDelete === 'string') {
    return delOne(index, toDelete);
  }
  return delMany(index, toDelete);
};

const updateOne = (index, id, newValues) => (
  db.update({
    id,
    index,
    body: {
      doc: newValues,
    },
  })
    .then((res) => res)
    .catch((error) => {
      if (error.statusCode === 404) {
        return { nSuccess: 0 };
      }
      throw new Error(error);
    })
);

const updateMany = (index, query, newValues) => {
  let updateString = '';
  Object.keys(newValues).forEach((key) => {
    updateString += `ctx._source.${key}="${newValues[key]}";`;
  });
  return db.updateByQuery({
    index,
    refresh: true,
    body: {
      script: {
        source: updateString,
        lang: 'painless',
      },
      query: {
        bool: {
          filter: Object.keys(query).map((key) => ({ match: { [key]: query[key] } })),
        },
      },
    },
  })
    .then((res) => res)
    .catch((error) => {
      throw new Error(error);
    });
};

const update = (index, toUpdate, newValues = {}) => {
  if (typeof toUpdate === 'string') {
    return updateOne(index, toUpdate, newValues);
  }
  return updateMany(index, toUpdate, newValues);
};

const drop = (index) => (
  db.indices.delete({ index })
    .then(() => true)
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
};
