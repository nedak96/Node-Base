const { UNAUTHORIZED } = require('../constants/responseCodes');

class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized', data = {}) {
    super(message);
    this.name = 'UNAUTHORIZED';
    this.statusCode = UNAUTHORIZED;
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
    Error.captureStackTrace(this, UnauthorizedError);
  }
}

module.exports = UnauthorizedError;
