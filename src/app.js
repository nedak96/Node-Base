const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { createConnection } = require('./db/elastic');
const { checkJwt, refreshJwt } = require('./utils/tokens');

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
app.use(morgan('dev'));

app.use(cors({
  origin: ['http://127.0.0.1:2100', 'http://127.0.0.1:3001'],
}));

app.use(checkJwt(false));
app.use(refreshJwt);

require('./api/v1')(app);

module.exports = app;
