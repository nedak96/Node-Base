const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { createConnection } = require('./db/elastic');
const { checkJwt } = require('./utils/tokens');

const { FRONTEND_DOMAIN, SERVER_DOMAIN } = process.env;

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
  origin: [FRONTEND_DOMAIN, SERVER_DOMAIN],
}));

app.use(checkJwt);

require('./api/v1')(app);

module.exports = app;
