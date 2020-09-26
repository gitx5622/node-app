const winston = require("winston");

module.exports = function () {
    process.on('unhandledRejection', (ex) => {
        throw (ex);
    })

    winston.exceptions.handle(
        new winston.transports.Console({
            colorize: true,
            prettyPrint: true
        }),
        new winston.transports.File({
            filename: "uncaughtExceptions.log"
        }));

    winston.add(new winston.transports.File({
        filename: "logfile.log"
    }));
}