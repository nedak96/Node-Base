const { CONFLICT_ERROR } = require('../constants/responseCodes');

class ConflictError extends Error {
  constructor(message = 'Conflict Error', data = {}) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = CONFLICT_ERROR;
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
    Error.captureStackTrace(this, ConflictError);
  }
}

module.exports = ConflictError;
