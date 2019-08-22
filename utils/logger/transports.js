const winston = require('winston');
const moment = require('moment');
const Transport = require('winston-transport');

const { format } = winston;
const { printf } = format;

const { error } = require('../../models');
const transporter = require('./index');
const { serviceEmail } = require('../../config');

class DBTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.level = opts.level;
  }

  log(info, callback) {
    error.create(info.message).then(() => callback());
  }
}

class EmailTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.level = opts.level;
  }

  log(info, callback) {
    const { error: errorText, routeName = 'Route path is empty', filename } = info.message;
    const mailOptions = {
      from: serviceEmail,
      to: serviceEmail,
      subject: `Error file: ${filename}`,
      html: `<p> Route error: ${routeName}</p><p>Message: ${errorText}</p>`,
    };
    transporter.sendMail(mailOptions, (err) => {
      console.error('EmailTransport error:', err);
      callback();
    });
  }
}

const consoleFormats = printf((info) => {
  if (info.level === '[32minfo[39m') {
    return `>>> \u001b[32m${info.message.text}\u001b[39m`;
  }
  if (info.level === '[33mwarn[39m') {
    return `>>> \u001b[33m${info.message.text}\u001b[39m
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
  consoleFormats,
};
