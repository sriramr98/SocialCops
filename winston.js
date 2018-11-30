const { createLogger, format, transports } = require('winston');
const { combine, label, timestamp, printf } = format;
const path = require('path');

const myFormat = printf(
    info => `${info.timestamp} [${info.level}]: ${info.label} - ${info.message}`
);
const logger = createLogger({
    level: 'info',
    format: combine(label({ label: 'main' }), timestamp(), myFormat),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: path.join(__dirname, 'logs', 'ap.log'),
            options: { flags: 'a', mode: 0o666 }
        })
    ]
});

module.exports = logger;
