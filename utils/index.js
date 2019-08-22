const nodemailer = require('nodemailer');
const config = require('../config');

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
const isObject = item => item && typeof item === 'object' && !Array.isArray(item);

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

exports.mergeDeep = mergeDeep;

/**
 * email sender transport
 */
exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  tls: true,
  auth: {
    user: config.serviceEmail,
    pass: config.servicePassword,
  },
});
