const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Sentry = require('@sentry/node');

// setup dotenv to read environment variables
dotenv.config();

// Load Environment Varibles
const env = require('./utils/env');

// INIT MONGODB CONNECTION
require('./mongoose');

// create a new express application
const app = express();

// INIT SENTRY
Sentry.init({
    dsn: env.SENTRY_DSN,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

// setup bodyparser middleware to read request body in requests
// we're only reading JSON inputs
app.use(bodyParser.json());

// Listen to API routes
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Start listening to requests
app.listen(env.PORT, () => {
    console.log(`Server started on PORT ${env.PORT}`);
});

module.exports = {
    app,
};
