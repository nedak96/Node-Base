const express = require('express');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { createConnection } = require('./db/mongo');

const redisClient = redis.createClient();

const dbSetup = async () => {
  try {
    await createConnection();
    console.log('DB Connection Created');
  } catch (error) {
    console.error(error);
  }
};

dbSetup();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: false, // True for production
    httpOnly: true,
  },
}));
app.use(morgan('dev'));

app.use(cors({
  origin: ['http://127.0.0.1:2100', 'http://127.0.0.1:3001'],
  credentials: true,
}));

require('./api/v1')(app);

module.exports = app;
