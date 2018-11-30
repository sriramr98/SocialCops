/**
 * This module initializes MONGODB Connection
 */
const mongoose = require('mongoose');
const logger = require('./winston');

const { MONGODB_URI } = require('./utils/env');

mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose
    .connect(
        MONGODB_URI,
        {
            useNewUrlParser: true
        }
    )
    .then(() => {
        logger.info('Connected to MONGODB');
    })
    .catch(e => {
        logger.error(`Error connecting to MONGODB ${e}`);
    });

module.exports = mongoose;
