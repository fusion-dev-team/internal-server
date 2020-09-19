const winston = require('winston');
const { DBTransport, EmailTransport, consoleFormats } = require('./transports');

const { format } = winston;
const { combine, colorize, prettyPrint } = format;

/**
 * Logger class to draw, send and keep through whole app
 */
class Logger {
  constructor() {
    this.winston = winston.createLogger({
      transports: [
        new DBTransport({ level: 'error' }),
        new EmailTransport({ level: 'error' }),
        new winston.transports.Console({
          format: combine(colorize(), prettyPrint(), consoleFormats)
        })
      ]
    });
  }

  getFilename() {
    const { stack } = Error('Error');
    const errorString = stack.split('\n')[3];
    /* eslint-disable  no-useless-escape */
    const result = errorString.match(/(?<=\()(.*?)(?=\:)/);
    return result ? result[0] : errorString;
  }

  /**
   *
   * @param msg {error, routeName, user}
   */
  error(msg) {
    msg.filename = this.getFilename();
    this.winston.error(msg);
  }

  /**
   *
   * @param msg {error, routeName, user}
   */
  debug(msg) {
    msg.filename = this.getFilename();
    this.winston.debug(msg);
  }

  /**
   *
   * @param msg {error, routeName, user}
   */
  info(msg) {
    this.winston.info(msg);
  }

  /**
   *
   * @param msg {error, routeName, user}
   */
  warn(msg) {
    msg.filename = this.getFilename();
    this.winston.warn(msg);
  }
}

module.exports = new Logger();
