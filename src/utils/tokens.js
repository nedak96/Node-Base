const axios = require('axios');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const {
  AUTH0_DOMAIN,
  AUTH0_API_CLIENT_ID,
  AUTH0_API_CLIENT_SECRET,
} = process.env;

let managementToken;

const isExpired = (token) => {
  if (token && jwt.decode(token)) {
    const { exp } = jwt.decode(token);
    return Date.now() >= exp * 1000;
  }
  return true;
};

const checkJwt = jwtMiddleware({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  credentialsRequired: false,
});

const getManagementToken = () => (
  isExpired(managementToken) ? (
    axios.post(`https://${AUTH0_DOMAIN}/oauth/token`,
      {
        client_id: AUTH0_API_CLIENT_ID,
        client_secret: AUTH0_API_CLIENT_SECRET,
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
        grant_type: 'client_credentials',
      },
      {
        headers: {
          contentType: 'application/json',
        },
      })
      .then((res) => {
        managementToken = res.data.access_token;
        return managementToken;
      })
  ) : managementToken
);

module.exports = {
  checkJwt,
  getManagementToken,
};
