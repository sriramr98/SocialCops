const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Sentry = require('@sentry/node');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

// create a new express application
const app = express();

// create the log folder if it doesn't exist
if (!fs.existsSync(__dirname + '/logs')) {
    fs.mkdirSync(__dirname + '/logs');
}

// setup logging using morgan
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'logs', 'access.log'),
    { flags: 'a' }
);
morgan.token('pid', (req, res) => {
    return _.get(req, 'session.user.pid') || 'Guest';
});
morgan.format(
    'myformat',
    ':pid - [:date[clf]] ":method :url" :status :res[content-length] - :response-time ms'
);

app.use(morgan('myformat', { stream: accessLogStream }));

const logger = require('./winston');

// setup dotenv to read environment variables
dotenv.config();

// Load Environment Varibles
const env = require('./utils/env');

// INIT MONGODB CONNECTION
require('./mongoose');

// only use sentry if there is a SENTRY_DSN link in the environment variables
if (env.SENTRY_DSN) {
    // INIT SENTRY
    Sentry.init({
        dsn: env.SENTRY_DSN
    });
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.errorHandler());
}

// setup bodyparser middleware to read request body in requests
// we're only reading JSON inputs
app.use(bodyParser.json());

// Listen to API routes
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Start listening to requests
app.listen(env.PORT, () => {
    logger.info(`Server started at port ${env.PORT}`);
});

module.exports = {
    app
};
