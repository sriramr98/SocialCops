'use strict';

// this module reads all Environmental Variables and
// sets a default value for testing

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI ||
    'mongodb://socialmongo:27017/socialcops',
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ||
    'somesecretkeythatyouwillneverfigureout',
    SENTRY_DSN: process.env.SENTRY_DSN,
    NODE_ENV: process.env.NODE_ENV || 'dev',
};
