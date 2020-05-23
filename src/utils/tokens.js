const jwt = require('jsonwebtoken');
const jwtMiddleware = require('express-jwt');

const SECRET = process.env.SECRET || 'shhhhhhh';


const generateToken = (user) => jwt.sign(user, SECRET, { expiresIn: '7d' });

const checkJwt = (isProtected = true) => jwtMiddleware({
  secret: SECRET,
  credentialsRequired: isProtected,
});

// Middleware for rolling expiration of token
const refreshJwt = (req, res, next) => {
  if (req.user) {
    const oldSend = res.send;
    delete req.user.exp;
    delete req.user.iat;
    res.send = (data) => {
      res.send = oldSend;
      res.send({ ...data, token: generateToken(req.user) });
    };
  }
  next();
};

module.exports = {
  generateToken,
  checkJwt,
  refreshJwt,
};
