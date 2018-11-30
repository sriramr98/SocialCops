/**
 * This module initializes MONGODB Connection
 */
const mongoose = require('mongoose');
const {
    MONGODB_URI,
} = require('./utils/env');

mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
}).then(() => {
    console.log('Connected to MONGODB');
}).catch((e) => {
    console.log(`Error connecting to MONGODB ${e}`);
});

module.exports = mongoose;
