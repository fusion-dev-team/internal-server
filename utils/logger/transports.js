const winston = require('winston');
const moment = require('moment');
const Transport = require('winston-transport');

const { format } = winston;
const { printf } = format;

// TODO: uncomment when all models be ready

const db = require('../../db/models');
const utils = require('../index');
const config = require('../../config');

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

    db.error.create(info.message).then(() => callback());
    // console.log('Log to DB about error');
    // callback();
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

    const { text: errorText, routeName = 'Route path is empty', filename } = info.message;
    const mailOptions = {
      from: config.mail.serviceEmail,
      to: config.mail.serviceEmail,
      subject: `Error file: ${filename}`,
      html: `<h2> Route error: ${routeName}</h2><p>${errorText}</p>`
    };
    utils.transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('Logger EmailTransport error:', err);
      }
      callback();
    });
    // console.log('Email info about error');
    // callback();
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
    route: ${info.message.routeName}`;
    // filename: ${info.message.filename}
  }
  return `>>> \u001b[31m${info.message.text}\u001b[39m
    route: ${info.message.routeName}
    (${moment().format('YYYY-MM-DD HH:mm:ss')})`;
});

module.exports = {
  DBTransport,
  EmailTransport,
  consoleFormats
};
