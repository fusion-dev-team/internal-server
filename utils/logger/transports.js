const winston = require('winston');
const moment = require('moment');
const Transport = require('winston-transport');

const { format } = winston;
const { printf } = format;

// TODO: uncomment when all models be ready

// const { error } = require('../../models');
// const transporter = require('./index');
// const { serviceEmail } = require('../../config');

/**
 * Transport for logger what writes to DB each critical error
 */
class DBTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.level = opts.level;
  }

  log(info, callback) {
    // TODO: uncomment when all models be ready

    // error.create(info.message).then(() => callback());
    console.log('Log to DB about error');
    callback();
  }
}

/**
 * Transport for logger what sends emails with info about critical errors
 */
class EmailTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.level = opts.level;
  }

  log(info, callback) {
    // TODO: uncomment when all models be ready

    // const { error: errorText, routeName = 'Route path is empty', filename } = info.message;
    // const mailOptions = {
    //   from: serviceEmail,
    //   to: serviceEmail,
    //   subject: `Error file: ${filename}`,
    //   html: `<p> Route error: ${routeName}</p><p>Message: ${errorText}</p>`,
    // };
    // transporter.sendMail(mailOptions, (err) => {
    //   console.error('EmailTransport error:', err);
    //   callback();
    // });
    console.log('Email info about error');
    callback();
  }
}

/**
 * Draw log in format depending on level
 */
const consoleFormats = printf((info) => {
  if (info.level === '[32minfo[39m') {
    return `>>> \u001b[32m${info.message.text}\u001b[39m`;
  }
  if (info.level === '[33mwarn[39m') {
    return `>>> \u001b[33m${info.message.text}\u001b[39m
    route: ${info.message.routeName}
    filename: ${info.message.filename}`;
  }
  return `>>> \u001b[31m${info.message.text}\u001b[39m
    route: ${info.message.routeName}
    filename: ${info.message.filename}
    (${moment().format('YYYY-MM-DD HH:mm:ss')})`;
});

module.exports = {
  DBTransport,
  EmailTransport,
  consoleFormats
};
